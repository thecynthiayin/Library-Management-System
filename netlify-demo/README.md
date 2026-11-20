# Book Nook – Library Management System (Live Demo)

A static demo of the Book Nook library system, ready to host on Netlify.

The original project is **PHP + MySQL**. Netlify only serves static files, so this
folder rebuilds the same screens with HTML, Bootstrap 3 and jQuery. The sample data
comes from `library.sql` and is kept in the browser's `localStorage`.
Visitors can log in, add books, issue and return books, and so on. Their changes stay
in their own browser. **Reset demo data** in the top banner restores the sample data.

## Demo logins

| Role    | Login              | Password   |
|---------|--------------------|------------|
| Student | `student@demo.com` | `demo123`  |
| Admin   | `admin`            | `admin123` |

## Features in the demo

- **Student:** login, signup, forgot password, dashboard with book availability, issued books, fines and a simulated "Pay Now", profile, change password
- **Admin:** dashboard stats, add/edit/delete categories, authors and books (ISBN must be unique), issue books with live student/ISBN lookup, return books with a suggested fine, block or unblock students, change password

## Deploy to Netlify

**Drag & drop:** go to <https://app.netlify.com/drop> and drop this `netlify-demo` folder.

**From Git:** push this folder to a GitHub repo, then in Netlify choose
*Add new site → Import from Git*. Leave the build command empty and set the publish directory to `.`
(or `netlify-demo` if it sits inside a larger repo).

## Run locally

Open `index.html` in a browser. No server is needed.
