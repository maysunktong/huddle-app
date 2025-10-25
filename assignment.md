Assignment - Social Media App
This assignment is intended to enhance your understanding of fullstack development. Focusing on aspects like database interaction, authentication, and CRUD (Create, Read, Update, Delete) operations. By the end of this assignment, you'll gain practical experience in managing relational data, structuring and querying a PostgreSQL database, and handling user authentication.
 
Requirements
 
Passing Grade (G)
 
✅ Authentication:
Users should be able to register an account, login, and logout
The authentication should be powered by Supabase Auth
The create post page should not be accessible to non-authenticated users
 
✅ Data Fetching and Error Handling:
Data should be fetched and revalidated in a way that ensures a smooth user experience
The user should be informed if an error occurs while trying to perform a CRUD operation
 
✅ Database Tables and Relational Data:
The following tables should be available in your database:
Users: This table will be managed by Supabase Auth and can contain additional user data
✅ Posts: A post should at least have a title, content and a slug. Each post should relate to the user who created it, implying a one-to-many relationship
 
✅ Images
Using a storage bucket the user should be able to:
 attach an image to their post
❌ edit (change) the image in their post
 
CRUD Operations:
  Posts
✅ All users should be able to read posts
An authenticated user should be able to create, update, and delete their own posts
✅ Only the author of the post should be able to access the edit post page
 
✅ Responsive Styling:
The design and what tools you want to use for styling is up to you, but the app should of course use modern CSS technologies and be responsive

----------------------------------------------------
 
Excellent Grade (VG)
 
⚠️ Search Functionality:
Implement search functionality allowing users to search for posts based on the title
 
✅ Comments
✅ Logged in users should be able to add comments to any post. Each comment should relate to the user who wrote it and the post it belongs to, creating a relationship between the users, posts, and comments tables
✅ All users should be able to read comments
✅ An authenticated user should be able to create and delete their own comments
✅ An author should be able to delete comments belonging to their posts

----------------------------------------------------
Super Excellent Grade (MVG)
 
Comments:
allow comments to be nested: users should be able to reply to specific comments and the nested comments are displayed in a chain
 
✅ Images:
Allow multiple images to be uploaded, edited and displayed in a post
 
Categories:
Add categories to the application. Posts should belong to a category, and the user should be able to go to a dynamic route that only displays the posts in that category.
 
----------------------------------------------------
Assignment Submission
Repository Access:
Submit the link to your GitHub repository and make sure the project is public
Deployment:
Submit the link to your deployed app on Vercel
----------------------------------------------------
