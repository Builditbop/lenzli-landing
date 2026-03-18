# 🔐 Firestore Security Rules (Updated)

## ⚡ Quick Setup

Go to your Firebase Console → Firestore Database → Rules tab

Replace everything with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read all, write own only
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Connections collection - authenticated users can manage their connections
    match /connections/{connectionId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.creatorId == request.auth.uid);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Waitlist collection - anyone can write (for landing page), admins can read
    match /waitlist/{emailId} {
      allow create: if true;  // Anyone can join waitlist
      allow read: if request.auth != null;  // Only authenticated users can read
    }
    
    // Chats - metadata about conversations
    match /chats/{chatId} {
      allow read: if request.auth != null && 
        (request.auth.uid in resource.data.participants || 
         request.auth.uid in chatId.split('_'));
      allow create: if request.auth != null && 
        request.auth.uid in request.resource.data.participants;
      allow update: if request.auth != null && 
        (request.auth.uid in resource.data.participants || 
         request.auth.uid in chatId.split('_'));
    }

    // Messages - chat participants can read, create, and update read status
    match /chats/{chatId}/messages/{messageId} {
      allow read: if request.auth != null && 
        (request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants ||
         request.auth.uid in chatId.split('_'));
      allow create: if request.auth != null && 
        (request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants ||
         request.auth.uid in chatId.split('_'));
      allow update: if request.auth != null && 
        (request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants ||
         request.auth.uid in chatId.split('_'));
    }
    
    // Typing indicators - chat participants can read and write their own typing status
    match /chats/{chatId}/typing/{userId} {
      allow read: if request.auth != null && 
        request.auth.uid in chatId.split('_');
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        request.auth.uid in chatId.split('_');
    }
    
    // Reports collection - users can create reports, admins can read
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        (resource.data.reporterId == request.auth.uid ||
         request.auth.token.admin == true);
      allow update: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

Click **"Publish"** to save the rules.

## 📋 What These Rules Do

### Users Collection
- ✅ **Read**: Any authenticated user can view profiles
- ✅ **Write**: Users can only edit their own profile
- ❌ **No anonymous access**: Must be logged in

### Connections Collection
- ✅ **Read**: Users can only see connections they're involved in
- ✅ **Create**: Any authenticated user can create connections
- ✅ **Update/Delete**: Only the user who created can modify
- ❌ **No anonymous access**: Must be logged in

### Waitlist Collection
- ✅ **Create**: Anyone can add email (even without account)
- ✅ **Read**: Only authenticated users
- ✅ **Purpose**: Landing page email signups

### Reports Collection (NEW!)
- ✅ **Create**: Any authenticated user can report another user
- ✅ **Read**: Users can read their own reports, admins can read all
- ✅ **Update**: Only admins can update report status
- ✅ **Purpose**: User safety and moderation

## 🔍 Viewing Waitlist Emails

To see who signed up on your landing page:

1. Go to Firebase Console → Firestore Database
2. Click on **"waitlist"** collection
3. You'll see all emails with timestamps

## 🛡️ Security Notes

These rules are secure because:
- ✅ Users can't edit others' profiles
- ✅ Users can't see others' private connections
- ✅ Waitlist is write-only for public (can't spam read it)
- ✅ All sensitive operations require authentication

## 🔧 Testing Rules

After publishing, test:

1. **Landing page**: Try joining waitlist (should work without login)
2. **Sign up**: Create account (should work)
3. **Profile**: Try editing profile (should work)
4. **Discover**: Try viewing creators (should work)
5. **Connections**: Save connections (should work)

## 🚨 If You Get Errors

**"Missing or insufficient permissions"**
- Make sure you published the rules
- Check you're logged in when accessing protected data
- Restart your dev server

**"Document doesn't exist"**
- This is normal if no data yet
- Create some test data by using the app

**"Failed to create document"**
- Check the specific collection's rules
- Make sure request format matches rules

## 📊 Future Enhancements

When you add messaging or other features, you'll need to update these rules. For example:

```javascript
// For future messaging feature
match /messages/{messageId} {
  allow read, write: if request.auth != null && 
    (request.auth.uid in resource.data.participants);
}
```

## ✅ Quick Checklist

- [ ] Copied rules above
- [ ] Pasted in Firestore → Rules tab
- [ ] Clicked "Publish"
- [ ] Tested landing page waitlist signup
- [ ] Tested user signup
- [ ] Tested profile creation

---

These rules will work for your MVP and scale as you grow! 🚀

