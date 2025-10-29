// NSFW Detection Utility using Cloudinary's AI Moderation
// This is FREE and built into Cloudinary!

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';

/**
 * Upload image with NSFW detection
 * @param {File} file - The image file to upload
 * @returns {Promise<{url: string, isNSFW: boolean, moderationScore: number}>}
 */
export const uploadWithNSFWDetection = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  formData.append('folder', 'lenzli-portfolios');
  formData.append('moderation', 'aws_rek:explicit'); // Enable AWS Rekognition moderation

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to upload image');
    }

    const data = await response.json();
    
    // Check moderation results
    const moderationData = data.moderation?.[0];
    const isNSFW = moderationData?.response?.moderation_labels?.some(
      label => label.name === 'explicit' && label.confidence > 0.5
    ) || false;

    return {
      url: data.secure_url,
      isNSFW,
      moderationScore: moderationData?.response?.moderation_labels?.[0]?.confidence || 0,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Upload with moderation error:', error);
    throw error;
  }
};

/**
 * Upload multiple images with NSFW detection
 * @param {File[]} files - Array of image files
 * @returns {Promise<Array<{url: string, isNSFW: boolean}>>}
 */
export const uploadMultipleWithNSFWDetection = async (files) => {
  const uploadPromises = files.map((file) => uploadWithNSFWDetection(file));
  const results = await Promise.all(uploadPromises);
  
  // Filter out NSFW images
  const safeImages = results.filter(result => !result.isNSFW);
  const rejectedCount = results.length - safeImages.length;
  
  if (rejectedCount > 0) {
    console.warn(`${rejectedCount} image(s) rejected due to inappropriate content`);
  }
  
  return {
    safeImages,
    rejectedCount,
    allResults: results
  };
};

/**
 * Simple client-side image validation before upload
 * @param {File} file - The image file
 * @returns {Promise<boolean>} - Whether the image passes basic checks
 */
export const validateImage = async (file) => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image must be less than 10MB');
  }

  // Check dimensions
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Minimum 400x400
      if (img.width < 400 || img.height < 400) {
        reject(new Error('Image must be at least 400x400 pixels'));
      } else {
        resolve(true);
      }
    };
    img.onerror = () => reject(new Error('Invalid image file'));
    img.src = URL.createObjectURL(file);
  });
};

