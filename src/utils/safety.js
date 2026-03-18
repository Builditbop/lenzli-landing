import { doc, updateDoc, getDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Block a user - adds them to the current user's blockedUsers array
 */
export const blockUser = async (currentUserId, userToBlockId) => {
  try {
    const userRef = doc(db, 'users', currentUserId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User profile not found');
    }

    const blockedUsers = userSnap.data().blockedUsers || [];
    
    if (blockedUsers.includes(userToBlockId)) {
      return { success: true, message: 'User is already blocked' };
    }

    await updateDoc(userRef, {
      blockedUsers: arrayUnion(userToBlockId),
      updatedAt: new Date().toISOString()
    });

    return { success: true, message: 'User blocked successfully' };
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
};

/**
 * Unblock a user - removes them from the current user's blockedUsers array
 */
export const unblockUser = async (currentUserId, userToUnblockId) => {
  try {
    const userRef = doc(db, 'users', currentUserId);
    await updateDoc(userRef, {
      blockedUsers: arrayRemove(userToUnblockId),
      updatedAt: new Date().toISOString()
    });

    return { success: true, message: 'User unblocked successfully' };
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
};

/**
 * Check if a user is blocked by the current user
 */
export const isUserBlocked = async (currentUserId, otherUserId) => {
  try {
    const userRef = doc(db, 'users', currentUserId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return false;
    }

    const blockedUsers = userSnap.data().blockedUsers || [];
    return blockedUsers.includes(otherUserId);
  } catch (error) {
    console.error('Error checking if user is blocked:', error);
    return false;
  }
};

/**
 * Get list of blocked users for the current user
 */
export const getBlockedUsers = async (currentUserId) => {
  try {
    const userRef = doc(db, 'users', currentUserId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return [];
    }

    return userSnap.data().blockedUsers || [];
  } catch (error) {
    console.error('Error getting blocked users:', error);
    return [];
  }
};

/**
 * Report a user - creates a report document in Firestore
 */
export const reportUser = async (reporterId, reportedUserId, reason, description = '') => {
  try {
    const reportsRef = collection(db, 'reports');
    await addDoc(reportsRef, {
      reporterId,
      reportedUserId,
      reason,
      description,
      status: 'pending',
      createdAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null
    });

    return { success: true, message: 'Report submitted successfully. Our team will review it.' };
  } catch (error) {
    console.error('Error reporting user:', error);
    throw error;
  }
};

/**
 * Filter out blocked users from an array of users
 */
export const filterBlockedUsers = async (currentUserId, users) => {
  try {
    const blockedUsers = await getBlockedUsers(currentUserId);
    if (blockedUsers.length === 0) {
      return users;
    }
    return users.filter(user => !blockedUsers.includes(user.id));
  } catch (error) {
    console.error('Error filtering blocked users:', error);
    return users;
  }
};


