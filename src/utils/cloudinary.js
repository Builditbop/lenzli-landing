// Cloudinary image upload utility (Free alternative to Firebase Storage)
// No upload preset needed! Uses Cloudinary's default unsigned upload

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';

/**
 * Upload image to Cloudinary using unsigned upload
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // Cloudinary's default unsigned preset
  formData.append('folder', 'lenzli-portfolios');

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
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {boolean} checkNSFW - Whether to check for NSFW content
 * @returns {Promise<string[] | {urls: string[], rejected: number}>} - Array of uploaded image URLs or object with results
 */
export const uploadMultipleImages = async (files, checkNSFW = false) => {
  if (checkNSFW) {
    // Use NSFW detection
    const { uploadMultipleWithNSFWDetection } = await import('./nsfwDetection');
    const results = await uploadMultipleWithNSFWDetection(files);
    return {
      urls: results.safeImages.map(img => img.url),
      rejected: results.rejectedCount,
      details: results.allResults
    };
  } else {
    // Regular upload without NSFW check
    const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
    return Promise.all(uploadPromises);
  }
};

