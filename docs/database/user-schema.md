# User Schema - CreatorFlow AI

## Purpose

The User schema stores authentication information and creator preferences that personalize the CreatorFlow AI experience.

---

## Fields

### name
Type: String
Required: Yes

The creator's full name.

---

### email
Type: String
Required: Yes
Unique: Yes

Used for login and communication.

---

### password
Type: String
Required: Yes

Stores the hashed password.

---

### niche
Type: String

The creator's primary content category.

Example:
- Technology
- Fashion
- Finance
- Education

---

### platforms
Type: Array

Example:

- TikTok
- Instagram
- Facebook
- LinkedIn
- X
- YouTube

Allows AI to create platform-specific content.

---

### goal
Type: String

Example:

- Grow followers
- Sell products
- Build personal brand

---

### writingStyle
Type: String

Example:

- Professional
- Friendly
- Funny
- Educational

Determines the AI's writing tone.

---

### experienceLevel
Type: String

Beginner

Intermediate

Advanced

---

### country
Type: String

Used for localization.

---

### timezone
Type: String

Used for scheduling posts.

---

### postingFrequency
Type: String

Daily

3x Weekly

Weekly

---

### preferredPostingTime
Type: String

Example

7:30 PM

---

### weeklyContentTime
Type: Number

Hours available every week for content creation.

---

### onboardingCompleted
Type: Boolean

Default:

false

Used to determine whether onboarding is complete.