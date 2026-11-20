/* Book Nook – static in-browser demo of the PHP/MySQL library system.
 * All "database" tables live in localStorage (falls back to memory). */
(function () {
    'use strict';

    var STORE_KEY = 'booknook-demo-v1';
    var SESSION_KEY = 'booknook-demo-session';
    var FINE_PER_DAY = 10; // THB, used to suggest a fine for late returns
    var LOAN_DAYS = 14;

    // ---------- seed data (mirrors sql file/library.sql; students are fictional) ----------
    function seed() {
        return {
            admin: { username: 'admin', password: 'admin123', fullName: 'Library Admin', email: 'admin@booknook.demo' },
            categories: [
                { id: 15, name: 'Classic American Literature', status: 1, created: '2025-05-31 04:18:02' },
                { id: 16, name: 'Fiction', status: 1, created: '2025-05-31 04:20:26' },
                { id: 17, name: 'Adventure', status: 1, created: '2025-05-31 04:20:37' },
                { id: 18, name: 'Romantic', status: 1, created: '2025-05-31 04:20:45' },
                { id: 19, name: 'Technology', status: 1, created: '2025-05-31 04:20:53' },
                { id: 20, name: 'Science', status: 1, created: '2025-05-31 04:21:01' },
                { id: 21, name: 'Management', status: 0, created: '2025-05-31 04:21:10' }
            ],
            authors: [
                { id: 10, name: 'George Orwell', created: '2025-05-25 06:37:23' },
                { id: 11, name: 'F. Scott Fitzgerald', created: '2025-05-25 06:38:05' },
                { id: 12, name: 'Harper Lee', created: '2025-05-25 06:38:27' },
                { id: 13, name: 'J.R.R. Tolkien', created: '2025-05-25 06:39:01' },
                { id: 14, name: 'Anne Frank', created: '2025-05-25 06:39:18' },
                { id: 15, name: 'J.K. Rowling', created: '2025-05-29 07:47:37' },
                { id: 16, name: 'Stephen King', created: '2025-05-29 07:47:48' },
                { id: 17, name: 'Jane Austen', created: '2025-05-29 07:48:01' },
                { id: 18, name: 'Dan Brown', created: '2025-05-29 07:48:14' },
                { id: 19, name: 'Charlotte Bronte', created: '2025-05-30 11:57:54' }
            ],
            books: [
                { id: 12, name: '1984', catId: 16, authorId: 10, isbn: '123', price: 350, created: '2025-05-31 04:28:12' },
                { id: 13, name: 'The Great Gatsby', catId: 15, authorId: 11, isbn: '1234', price: 300, created: '2025-05-31 04:28:52' },
                { id: 14, name: 'To Kill a Mockingbird', catId: 16, authorId: 12, isbn: '2345', price: 400, created: '2025-05-31 04:29:25' },
                { id: 15, name: 'The Lord of the Rings', catId: 17, authorId: 13, isbn: '3456', price: 150, created: '2025-05-31 04:29:55' },
                { id: 16, name: 'The Diary of a Young Girl', catId: 15, authorId: 14, isbn: '4567', price: 145, created: '2025-05-31 04:30:27' },
                { id: 17, name: 'Pride and Prejudice', catId: 18, authorId: 17, isbn: '5678', price: 465, created: '2025-05-31 04:31:06' },
                { id: 18, name: 'Jane Eyre', catId: 18, authorId: 19, isbn: '7890', price: 466, created: '2025-05-31 04:31:40' }
            ],
            students: [
                { id: 12, sid: 'SID013', name: 'Demo Student', email: 'student@demo.com', mobile: '0812345678', password: 'demo123', status: 1, created: '2025-05-24 07:57:40' },
                { id: 13, sid: 'SID014', name: 'Alex Morgan', email: 'alex@example.com', mobile: '0823456789', password: 'x', status: 1, created: '2025-05-25 16:06:32' },
                { id: 14, sid: 'SID015', name: 'Priya Shah', email: 'priya@example.com', mobile: '0834567890', password: 'x', status: 1, created: '2025-05-29 08:46:06' },
                { id: 15, sid: 'SID016', name: 'Leo Tanaka', email: 'leo@example.com', mobile: '0845678901', password: 'x', status: 1, created: '2025-05-28 08:58:48' },
                { id: 16, sid: 'SID017', name: 'Maya Chen', email: 'maya@example.com', mobile: '0856789012', password: 'x', status: 0, created: '2025-05-31 04:48:49' },
                { id: 17, sid: 'SID019', name: 'Sam Okafor', email: 'sam@example.com', mobile: '0867890123', password: 'x', status: 1, created: '2025-06-04 06:55:29' }
            ],
            issued: [
                { id: 12, bookId: 15, sid: 'SID015', issued: '2025-05-31 04:33:54', returned: '2025-06-03 03:40:17', status: 1, fine: 50, paid: false },
                { id: 13, bookId: 18, sid: 'SID014', issued: '2025-05-31 04:34:10', returned: null, status: null, fine: null, paid: false },
                { id: 14, bookId: 13, sid: 'SID013', issued: '2025-05-31 04:35:19', returned: '2025-05-31 04:36:28', status: 1, fine: 0, paid: false },
                { id: 15, bookId: 16, sid: 'SID013', issued: '2025-05-31 04:37:03', returned: '2025-06-20 04:52:15', status: 1, fine: 60, paid: false },
                { id: 16, bookId: 12, sid: 'SID013', issued: '2025-06-04 06:44:06', returned: null, status: null, fine: null, paid: false }
            ]
        };
    }

    // ---------- storage ----------
    var memory = {};
    function storeGet(key) {
        try { return window.localStorage.getItem(key); } catch (e) { return memory[key] || null; }
    }
    function storeSet(key, val) {
        try { window.localStorage.setItem(key, val); } catch (e) { memory[key] = val; }
    }
    function storeDel(key) {
        try { window.localStorage.removeItem(key); } catch (e) { delete memory[key]; }
    }

    var db;
    function load() {
        try { db = JSON.parse(storeGet(STORE_KEY)); } catch (e) { db = null; }
        if (!db || !db.books) { db = seed(); save(); }
    }
    function save() { storeSet(STORE_KEY, JSON.stringify(db)); }

    var session;
    function loadSession() {
        try { session = JSON.parse(storeGet(SESSION_KEY)) || {}; } catch (e) { session = {}; }
    }
    function setSession(s) { session = s; storeSet(SESSION_KEY, JSON.stringify(s)); }

    // ---------- helpers ----------
    function esc(v) {
        return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function now() {
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' +
            p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    }
    function nextId(list) { return list.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1; }
    function byId(list, id) { id = Number(id); for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
    function student(sid) { for (var i = 0; i < db.students.length; i++) if (db.students[i].sid === sid) return db.students[i]; return null; }
    function bookOnLoan(bookId) { return db.issued.some(function (r) { return r.bookId === bookId && r.status == null; }); }
    function catName(id) { var c = byId(db.categories, id); return c ? c.name : '-'; }
    function authName(id) { var a = byId(db.authors, id); return a ? a.name : '-'; }
    function daysBetween(a, b) { return Math.floor((new Date(b.replace(' ', 'T')) - new Date(a.replace(' ', 'T'))) / 86400000); }

    var toastTimer;
    function toast(msg, isError) {
        var t = document.getElementById('toast');
        t.textContent = msg;
        t.className = 'demo-toast show' + (isError ? ' error' : '');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { t.className = 'demo-toast' + (isError ? ' error' : ''); }, 2600);
    }
    function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
    function formData(form) {
        var o = {};
        $(form).serializeArray().forEach(function (f) { o[f.name] = $.trim(f.value); });
        return o;
    }

    // ---------- layout pieces ----------
    function heading(t) {
        return '<div class="row pad-botm"><div class="col-md-12"><h4 class="header-line">' + esc(t) + '</h4></div></div>';
    }
    function panel(title, body, cls, cols) {
        return '<div class="row"><div class="' + (cols || 'col-md-6 col-sm-8 col-xs-12 col-md-offset-3 col-sm-offset-2') + '">' +
            '<div class="panel ' + (cls || 'panel-info') + '"><div class="panel-heading">' + esc(title) + '</div>' +
            '<div class="panel-body">' + body + '</div></div></div></div>';
    }
    function field(label, name, value, type, extra) {
        return '<div class="form-group"><label>' + esc(label) + '</label>' +
            '<input class="form-control" type="' + (type || 'text') + '" name="' + name + '" value="' + esc(value || '') + '" ' + (extra || 'required') + ' autocomplete="off" /></div>';
    }
    function select(label, name, options, selected) {
        return '<div class="form-group"><label>' + esc(label) + '</label><select class="form-control" name="' + name + '" required>' +
            '<option value="">Select ' + esc(label.replace(/<[^>]*>/g, '')) + '</option>' +
            options.map(function (o) {
                return '<option value="' + esc(o.value) + '"' + (String(o.value) === String(selected) ? ' selected' : '') + '>' + esc(o.label) + '</option>';
            }).join('') + '</select></div>';
    }
    function table(title, headers, rows, opts) {
        opts = opts || {};
        return '<div class="row"><div class="col-md-12"><div class="panel panel-default">' +
            '<div class="panel-heading">' + esc(title) + '</div><div class="panel-body">' +
            '<input type="search" class="form-control table-search" placeholder="Search..." aria-label="Search table" />' +
            '<div class="table-responsive"><table class="table table-striped table-bordered table-hover">' +
            '<thead><tr>' + headers.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
            (rows.length ? rows.join('') : '<tr><td colspan="' + headers.length + '" class="text-center">No records found</td></tr>') +
            '</tbody></table></div></div></div></div></div>';
    }
    function tr(cells) { return '<tr class="odd gradeX">' + cells.map(function (c) { return '<td class="center">' + c + '</td>'; }).join('') + '</tr>'; }
    function statusLabel(on, yes, no) {
        return on ? '<span class="label label-success">' + (yes || 'Active') + '</span>' : '<span class="label label-danger">' + (no || 'Inactive') + '</span>';
    }
    function widget(cls, icon, n, label) {
        return '<div class="col-md-3 col-sm-3 col-xs-6"><div class="alert ' + cls + ' back-widget-set text-center">' +
            '<i class="fa ' + icon + ' fa-5x"></i><h3>' + esc(n) + '</h3>' + esc(label) + '</div></div>';
    }

    // ---------- menus ----------
    function dropdown(label, items) {
        return '<li><a href="#" class="dropdown-toggle" data-toggle="dropdown">' + esc(label) + ' <i class="fa fa-angle-down"></i></a>' +
            '<ul class="dropdown-menu" role="menu">' + items.map(function (i) {
                return '<li role="presentation"><a role="menuitem" tabindex="-1" href="' + i[1] + '">' + esc(i[0]) + '</a></li>';
            }).join('') + '</ul></li>';
    }
    function link(label, href) { return '<li><a href="' + href + '">' + esc(label) + '</a></li>'; }

    function renderChrome(route) {
        var menu, logout = '';
        if (session.role === 'admin') {
            menu = link('Dashboard', '#/admin') +
                dropdown('Categories', [['Add Category', '#/admin/categories/add'], ['Manage Categories', '#/admin/categories']]) +
                dropdown('Authors', [['Add Author', '#/admin/authors/add'], ['Manage Authors', '#/admin/authors']]) +
                dropdown('Books', [['Add Book', '#/admin/books/add'], ['Manage Books', '#/admin/books']]) +
                dropdown('Issue Books', [['Issue New Book', '#/admin/issue'], ['Manage Issued Books', '#/admin/issued']]) +
                link('Reg Students', '#/admin/students') + link('Change Password', '#/admin/change-password');
        } else if (session.role === 'student') {
            menu = link('Dashboard', '#/dashboard') +
                dropdown('Account', [['My Profile', '#/profile'], ['Change Password', '#/change-password']]) +
                link('Issued Books', '#/issued');
        } else {
            menu = link('Admin Login', '#/admin-login') + link('User Signup', '#/signup') + link('User Login', '#/login');
        }
        if (session.role) logout = '<a href="#/logout" class="btn btn-danger pull-right">LOG ME OUT</a>';
        $('#menu-top').html(menu);
        $('#logout-slot').html(logout);
        $('#menu-top > li > a').each(function () {
            var h = $(this).attr('href');
            if (h !== '#' && h === route) $(this).addClass('menu-top-active');
        });
        $('.navbar-collapse').removeClass('in');
    }

    // ---------- pages: public ----------
    var pages = {};

    pages['/login'] = function () {
        return heading('User Login Form') + panel('LOGIN FORM',
            '<div class="demo-creds"><strong>Demo student:</strong> <code>student@demo.com</code> / <code>demo123</code><br>' +
            '<button type="button" class="btn btn-xs btn-default" data-fill="student@demo.com|demo123">Fill demo login</button></div>' +
            '<form data-action="student-login">' +
            field('Enter Email id', 'email', '', 'email') +
            '<div class="form-group"><label>Password</label><input class="form-control" type="password" name="password" required autocomplete="off" />' +
            '<p class="help-block"><a href="#/forgot">Forgot Password</a></p></div>' +
            '<button type="submit" class="btn btn-info">LOGIN</button> | <a href="#/signup">Not Registered Yet</a></form>');
    };

    pages['/admin-login'] = function () {
        return heading('Admin Login Form') + panel('LOGIN FORM',
            '<div class="demo-creds"><strong>Demo admin:</strong> <code>admin</code> / <code>admin123</code><br>' +
            '<button type="button" class="btn btn-xs btn-default" data-fill="admin|admin123">Fill demo login</button></div>' +
            '<form data-action="admin-login">' + field('Enter Username', 'email') + field('Password', 'password', '', 'password') +
            '<button type="submit" class="btn btn-info">LOGIN</button></form>');
    };

    pages['/signup'] = function () {
        return heading('User Signup') + panel('SIGNUP FORM',
            '<form data-action="signup">' + field('Enter Full Name', 'name') +
            field('Mobile Number', 'mobile', '', 'tel', 'required maxlength="12"') +
            field('Enter Email', 'email', '', 'email') + field('Enter Password', 'password', '', 'password') +
            field('Confirm Password', 'confirm', '', 'password') +
            '<button type="submit" class="btn btn-danger">Register Now</button></form>', 'panel-danger');
    };

    pages['/forgot'] = function () {
        return heading('User Password Recovery') + panel('LOGIN FORM',
            '<form data-action="forgot">' + field('Enter Reg Email id', 'email', '', 'email') +
            field('Enter Reg Mobile No', 'mobile') + field('Password', 'password', '', 'password') +
            field('Confirm Password', 'confirm', '', 'password') +
            '<button type="submit" class="btn btn-info">Change Password</button> | <a href="#/login">Login</a></form>');
    };

    // ---------- pages: student ----------
    pages['/dashboard'] = function () {
        var mine = db.issued.filter(function (r) { return r.sid === session.sid; });
        var open = mine.filter(function (r) { return r.status == null; }).length;
        var rows = db.books.map(function (b, i) {
            var on = bookOnLoan(b.id);
            return tr([i + 1, esc(b.name), esc(catName(b.catId)), esc(authName(b.authorId)), esc(b.isbn),
                statusLabel(!on, 'Available', 'Not Available')]);
        });
        return heading('Dashboard') + '<div class="row">' +
            widget('alert-info', 'fa-bars', mine.length, 'Books Issued') +
            widget('alert-warning', 'fa-recycle', open, 'Books Not Returned Yet') + '</div>' +
            table('Available Books', ['#', 'Book Name', 'Category', 'Author', 'ISBN', 'Status'], rows);
    };

    pages['/issued'] = function () {
        var rows = db.issued.filter(function (r) { return r.sid === session.sid; }).map(function (r, i) {
            var b = byId(db.books, r.bookId) || {};
            var action;
            if (r.status == null) action = '<span class="label label-warning">Not returned yet</span>';
            else if (!r.fine) action = '<span class="label label-success">No fine</span>';
            else if (r.paid) action = '<span class="label label-success">Paid</span>';
            else action = '<button class="btn btn-primary btn-xs" data-pay="' + r.id + '">Pay Now</button>';
            return tr([i + 1, esc(b.name), esc(b.isbn), esc(r.issued), r.returned ? esc(r.returned) : '<span style="color:red">Not Return Yet</span>',
                esc(r.fine == null ? '' : r.fine), action]);
        });
        return heading('Manage Issued Books') +
            table('Issued Books', ['#', 'Book Name', 'ISBN', 'Issued Date', 'Return Date', 'Fine in (THB)', 'Action'], rows);
    };

    pages['/profile'] = function () {
        var s = student(session.sid);
        return heading('My Profile') + panel('My Profile',
            '<form data-action="profile">' +
            '<div class="form-group"><label>Student ID : </label> ' + esc(s.sid) + '</div>' +
            '<div class="form-group"><label>Reg Date : </label> ' + esc(s.created) + '</div>' +
            '<div class="form-group"><label>Profile Status : </label> ' + statusLabel(s.status, 'Active', 'Blocked') + '</div>' +
            field('Enter Full Name', 'name', s.name) + field('Mobile Number', 'mobile', s.mobile, 'tel') +
            '<div class="form-group"><label>Enter Email</label><input class="form-control" type="email" value="' + esc(s.email) + '" readonly /></div>' +
            '<button type="submit" class="btn btn-primary">Update Now</button></form>', 'panel-danger');
    };

    function changePasswordPage() {
        return heading('User Change Password') + panel('Change Password',
            '<form data-action="change-password">' + field('Current Password', 'current', '', 'password') +
            field('Enter Password', 'password', '', 'password') + field('Confirm Password', 'confirm', '', 'password') +
            '<button type="submit" class="btn btn-info">Change</button></form>');
    }
    pages['/change-password'] = changePasswordPage;

    // ---------- pages: admin ----------
    pages['/admin'] = function () {
        var returned = db.issued.filter(function (r) { return r.status == 1; }).length;
        var slides = [1, 2, 3].map(function (n) {
            return '<div class="item' + (n === 1 ? ' active' : '') + '"><img src="assets/img/' + n + '.jpg" alt="Library shelves" /></div>';
        }).join('');
        return heading('Admin Dashboard') + '<div class="row">' +
            widget('alert-success', 'fa-book', db.books.length, 'Books Listed') +
            widget('alert-info', 'fa-bars', db.issued.length, 'Times Book Issued') +
            widget('alert-warning', 'fa-recycle', returned, 'Times Books Returned') +
            widget('alert-danger', 'fa-users', db.students.length, 'Registered Users') +
            widget('alert-success', 'fa-user', db.authors.length, 'Authors Listed') +
            widget('alert-info', 'fa-file-archive-o', db.categories.length, 'Listed Categories') + '</div>' +
            '<div class="row"><div class="col-md-12"><div id="carousel-example" class="carousel slide slide-bdr" data-ride="carousel">' +
            '<div class="carousel-inner">' + slides + '</div>' +
            '<ol class="carousel-indicators"><li data-target="#carousel-example" data-slide-to="0" class="active"></li>' +
            '<li data-target="#carousel-example" data-slide-to="1"></li><li data-target="#carousel-example" data-slide-to="2"></li></ol>' +
            '<a class="left carousel-control" href="#carousel-example" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a>' +
            '<a class="right carousel-control" href="#carousel-example" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>' +
            '</div></div></div>';
    };

    // categories
    pages['/admin/categories'] = function () {
        return heading('Manage Categories') + table('Categories Listing', ['#', 'Category', 'Status', 'Creation Date', 'Action'],
            db.categories.map(function (c, i) {
                return tr([i + 1, esc(c.name), statusLabel(c.status), esc(c.created), crud('categories', c.id)]);
            }));
    };
    function categoryForm(c) {
        c = c || { status: 1 };
        return '<form data-action="save-category" data-id="' + (c.id || '') + '">' + field('Category Name', 'name', c.name) +
            '<div class="form-group"><label>Status</label>' +
            '<div class="radio"><label><input type="radio" name="status" value="1"' + (c.status ? ' checked' : '') + '> Active</label></div>' +
            '<div class="radio"><label><input type="radio" name="status" value="0"' + (!c.status ? ' checked' : '') + '> Inactive</label></div></div>' +
            '<button type="submit" class="btn btn-info">' + (c.id ? 'Update' : 'Create') + '</button></form>';
    }
    pages['/admin/categories/add'] = function () { return heading('Add Category') + panel('Category Info', categoryForm()); };
    pages['/admin/categories/edit'] = function (id) {
        var c = byId(db.categories, id);
        return c ? heading('Edit Category') + panel('Category Info', categoryForm(c)) : notFound();
    };

    // authors
    pages['/admin/authors'] = function () {
        return heading('Manage Authors') + table('Authors Listing', ['#', 'Author', 'Creation Date', 'Action'],
            db.authors.map(function (a, i) { return tr([i + 1, esc(a.name), esc(a.created), crud('authors', a.id)]); }));
    };
    function authorForm(a) {
        a = a || {};
        return '<form data-action="save-author" data-id="' + (a.id || '') + '">' + field('Author Name', 'name', a.name) +
            '<button type="submit" class="btn btn-info">' + (a.id ? 'Update' : 'Add') + '</button></form>';
    }
    pages['/admin/authors/add'] = function () { return heading('Add Author') + panel('Author Info', authorForm()); };
    pages['/admin/authors/edit'] = function (id) {
        var a = byId(db.authors, id);
        return a ? heading('Edit Author') + panel('Author Info', authorForm(a)) : notFound();
    };

    // books
    pages['/admin/books'] = function () {
        return heading('Manage Books') + table('Books Listing', ['#', 'Book Name', 'Category', 'Author', 'ISBN', 'Price', 'Action'],
            db.books.map(function (b, i) {
                return tr([i + 1, esc(b.name), esc(catName(b.catId)), esc(authName(b.authorId)), esc(b.isbn), esc(b.price), crud('books', b.id)]);
            }));
    };
    function bookForm(b) {
        b = b || {};
        var cats = db.categories.filter(function (c) { return c.status || c.id === b.catId; })
            .map(function (c) { return { value: c.id, label: c.name }; });
        var auths = db.authors.map(function (a) { return { value: a.id, label: a.name }; });
        return '<form data-action="save-book" data-id="' + (b.id || '') + '">' + field('Book Name', 'name', b.name) +
            select('Category', 'catId', cats, b.catId) + select('Author', 'authorId', auths, b.authorId) +
            field('ISBN Number', 'isbn', b.isbn) + '<p class="help-block" style="margin-top:-10px">An ISBN is an International Standard Book Number. ISBN must be unique.</p>' +
            field('Price (THB)', 'price', b.price, 'number', 'required min="0"') +
            '<button type="submit" class="btn btn-info">' + (b.id ? 'Update' : 'Submit') + '</button></form>';
    }
    pages['/admin/books/add'] = function () { return heading('Add Book') + panel('Book Info', bookForm()); };
    pages['/admin/books/edit'] = function (id) {
        var b = byId(db.books, id);
        return b ? heading('Edit Book') + panel('Book Info', bookForm(b)) : notFound();
    };

    function crud(kind, id) {
        return '<a href="#/admin/' + kind + '/edit/' + id + '" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i> Edit</a> ' +
            '<button class="btn btn-danger btn-xs" data-delete="' + kind + '" data-id="' + id + '"><i class="fa fa-trash"></i> Delete</button>';
    }

    // issuing
    pages['/admin/issue'] = function () {
        return heading('Issue a New Book') + panel('Issue a New Book',
            '<form data-action="issue">' +
            '<div class="form-group"><label>Student ID <span style="color:red">*</span></label>' +
            '<input class="form-control" type="text" name="sid" id="issue-sid" placeholder="e.g. SID013" required autocomplete="off" />' +
            '<span id="student-lookup" class="help-block"></span></div>' +
            '<div class="form-group"><label>ISBN Number <span style="color:red">*</span></label>' +
            '<input class="form-control" type="text" name="isbn" id="issue-isbn" placeholder="e.g. 3456" required autocomplete="off" />' +
            '<span id="book-lookup" class="help-block"></span></div>' +
            '<button type="submit" class="btn btn-info">Issue Book</button></form>');
    };

    pages['/admin/issued'] = function () {
        var rows = db.issued.map(function (r, i) {
            var b = byId(db.books, r.bookId) || {}, s = student(r.sid) || {};
            return tr([i + 1, esc(s.name || r.sid), esc(b.name), esc(b.isbn), esc(r.issued),
                r.returned ? esc(r.returned) : '<span style="color:red">Not Return Yet</span>',
                '<a href="#/admin/issued/' + r.id + '" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i> Edit</a>']);
        });
        return heading('Manage Issued Books') +
            table('Issued Books', ['#', 'Student Name', 'Book Name', 'ISBN', 'Issued Date', 'Return Date', 'Action'], rows);
    };

    pages['/admin/issued/detail'] = function (id) {
        var r = byId(db.issued, id);
        if (!r) return notFound();
        var b = byId(db.books, r.bookId) || {}, s = student(r.sid) || {};
        var late = Math.max(0, daysBetween(r.issued, now()) - LOAN_DAYS);
        var body = '<form data-action="return" data-id="' + r.id + '">' +
            '<div class="form-group"><label>Student Name :</label> ' + esc(s.name) + ' (' + esc(r.sid) + ')</div>' +
            '<div class="form-group"><label>Book Name :</label> ' + esc(b.name) + '</div>' +
            '<div class="form-group"><label>ISBN :</label> ' + esc(b.isbn) + '</div>' +
            '<div class="form-group"><label>Book Issued Date :</label> ' + esc(r.issued) + '</div>' +
            '<div class="form-group"><label>Book Returned Date :</label> ' + (r.returned ? esc(r.returned) : 'Not Return Yet') + '</div>';
        if (r.status == null) {
            body += field('Fine (in THB) :', 'fine', late * FINE_PER_DAY, 'number', 'required min="0"') +
                '<p class="help-block" style="margin-top:-10px">Suggested: ' + late + ' day(s) late &times; ' + FINE_PER_DAY + ' THB</p>' +
                '<button type="submit" class="btn btn-info">Return Book</button>';
        } else {
            body += '<div class="form-group"><label>Fine (in THB) :</label> ' + esc(r.fine) +
                (r.fine ? ' ' + statusLabel(r.paid, 'Paid', 'Unpaid') : '') + '</div>';
        }
        return heading('Issued Book Details') + panel('Issued Book Details', body + '</form>');
    };

    pages['/admin/students'] = function () {
        return heading('Manage Reg Students') + table('Reg Students', ['#', 'Student ID', 'Student Name', 'Email id', 'Mobile Number', 'Reg Date', 'Status', 'Action'],
            db.students.map(function (s, i) {
                return tr([i + 1, esc(s.sid), esc(s.name), esc(s.email), esc(s.mobile), esc(s.created), statusLabel(s.status, 'Active', 'Blocked'),
                    s.status ? '<button class="btn btn-danger btn-xs" data-toggle-student="' + s.id + '">Inactive</button>'
                        : '<button class="btn btn-primary btn-xs" data-toggle-student="' + s.id + '">Active</button>']);
            }));
    };

    pages['/admin/change-password'] = changePasswordPage;

    function notFound() {
        return heading('Not found') + '<p>That record does not exist. <a href="javascript:history.back()">Go back</a></p>';
    }

    // ---------- router ----------
    var STUDENT = ['/dashboard', '/issued', '/profile', '/change-password'];

    function resolve(path) {
        var m;
        if ((m = path.match(/^\/admin\/(categories|authors|books)\/edit\/(\d+)$/))) return [pages['/admin/' + m[1] + '/edit'], m[2]];
        if ((m = path.match(/^\/admin\/issued\/(\d+)$/))) return [pages['/admin/issued/detail'], m[1]];
        return [pages[path]];
    }

    function render() {
        var path = (location.hash || '#/').slice(1) || '/';
        if (path === '/logout') { setSession({}); toast('You have been logged out'); return go('#/login'); }
        if (path === '/') return go(session.role === 'admin' ? '#/admin' : session.role === 'student' ? '#/dashboard' : '#/login');

        var isAdminPage = path.indexOf('/admin') === 0 && path !== '/admin-login';
        if (isAdminPage && session.role !== 'admin') return go('#/admin-login');
        if (STUDENT.indexOf(path) > -1 && session.role !== 'student') return go('#/login');

        var r = resolve(path);
        if (!r[0]) return go('#/');
        renderChrome('#' + path);
        $('#app').html(r[0](r[1]));
        $('.carousel').carousel({ interval: 3000 });
        window.scrollTo(0, 0);
    }

    // ---------- actions ----------
    var actions = {
        'student-login': function (d) {
            var s = db.students.filter(function (x) { return x.email.toLowerCase() === d.email.toLowerCase() && x.password === d.password; })[0];
            if (!s) return toast('Invalid Details', true);
            if (!s.status) return toast('Your account has been blocked. Please contact admin', true);
            setSession({ role: 'student', sid: s.sid });
            go('#/dashboard');
        },
        'admin-login': function (d) {
            if (d.email !== db.admin.username || d.password !== db.admin.password) return toast('Invalid Details', true);
            setSession({ role: 'admin' });
            go('#/admin');
        },
        'signup': function (d) {
            if (d.password !== d.confirm) return toast('Password and Confirm Password do not match', true);
            if (db.students.some(function (s) { return s.email.toLowerCase() === d.email.toLowerCase(); })) return toast('Email already exists', true);
            var last = db.students.reduce(function (m, s) { return Math.max(m, parseInt(s.sid.slice(3), 10) || 0); }, 0);
            var sid = 'SID' + ('00' + (last + 1)).slice(-3);
            db.students.push({ id: nextId(db.students), sid: sid, name: d.name, email: d.email, mobile: d.mobile, password: d.password, status: 1, created: now() });
            save();
            setSession({ role: 'student', sid: sid });
            toast('Registration successful. Your student ID is ' + sid);
            go('#/dashboard');
        },
        'forgot': function (d) {
            if (d.password !== d.confirm) return toast('Password and Confirm Password do not match', true);
            var s = db.students.filter(function (x) { return x.email.toLowerCase() === d.email.toLowerCase() && x.mobile === d.mobile; })[0];
            if (!s) return toast('Email id or Mobile no is invalid', true);
            s.password = d.password; save();
            toast('Your password has been changed successfully');
            go('#/login');
        },
        'profile': function (d) {
            var s = student(session.sid);
            s.name = d.name; s.mobile = d.mobile; save();
            toast('Your profile has been updated');
            render();
        },
        'change-password': function (d) {
            var acct = session.role === 'admin' ? db.admin : student(session.sid);
            if (acct.password !== d.current) return toast('Your current password is wrong', true);
            if (d.password !== d.confirm) return toast('New Password and Confirm Password do not match', true);
            acct.password = d.password; save();
            toast('Your password has been changed successfully');
            render();
        },
        'save-category': function (d, id) {
            upsert(db.categories, id, { name: d.name, status: Number(d.status) });
            toast(id ? 'Category updated successfully' : 'Category listed successfully');
            go('#/admin/categories');
        },
        'save-author': function (d, id) {
            upsert(db.authors, id, { name: d.name });
            toast(id ? 'Author info updated successfully' : 'Author listed successfully');
            go('#/admin/authors');
        },
        'save-book': function (d, id) {
            var dup = db.books.some(function (b) { return b.isbn === d.isbn && b.id !== Number(id); });
            if (dup) return toast('ISBN already exists', true);
            upsert(db.books, id, { name: d.name, catId: Number(d.catId), authorId: Number(d.authorId), isbn: d.isbn, price: Number(d.price) });
            toast(id ? 'Book info updated successfully' : 'Book listed successfully');
            go('#/admin/books');
        },
        'issue': function (d) {
            var s = student(d.sid.toUpperCase());
            var b = db.books.filter(function (x) { return x.isbn === d.isbn; })[0];
            if (!s) return toast('Invalid Student ID', true);
            if (!s.status) return toast('This student is blocked', true);
            if (!b) return toast('Invalid ISBN Number', true);
            if (bookOnLoan(b.id)) return toast('This book is already issued', true);
            db.issued.push({ id: nextId(db.issued), bookId: b.id, sid: s.sid, issued: now(), returned: null, status: null, fine: null, paid: false });
            save();
            toast('Book issued successfully');
            go('#/admin/issued');
        },
        'return': function (d, id) {
            var r = byId(db.issued, id);
            r.fine = Number(d.fine) || 0; r.status = 1; r.returned = now(); save();
            toast('Book returned successfully');
            go('#/admin/issued');
        }
    };

    function upsert(list, id, fields) {
        var rec = id ? byId(list, id) : null;
        if (rec) { $.extend(rec, fields); rec.updated = now(); }
        else list.push($.extend({ id: nextId(list), created: now() }, fields));
        save();
    }

    // ---------- events ----------
    $(document).on('submit', 'form[data-action]', function (e) {
        e.preventDefault();
        actions[$(this).data('action')](formData(this), $(this).attr('data-id'));
    });

    $(document).on('click', '[data-fill]', function () {
        var p = $(this).data('fill').split('|'), f = $(this).closest('.panel-body').find('form');
        f.find('[name=email]').val(p[0]);
        f.find('[name=password]').val(p[1]);
    });

    $(document).on('click', '[data-delete]', function () {
        var kind = $(this).data('delete'), id = Number($(this).data('id'));
        if (kind === 'books' && bookOnLoan(id)) return toast('This book is currently issued and cannot be deleted', true);
        if (kind === 'categories' && db.books.some(function (b) { return b.catId === id; })) return toast('Category is used by a book', true);
        if (kind === 'authors' && db.books.some(function (b) { return b.authorId === id; })) return toast('Author is used by a book', true);
        var btn = $(this);
        if (!btn.hasClass('confirming')) {
            btn.addClass('confirming').html('Click again to confirm');
            setTimeout(function () { btn.removeClass('confirming').html('<i class="fa fa-trash"></i> Delete'); }, 3000);
            return;
        }
        db[kind] = db[kind].filter(function (x) { return x.id !== id; });
        save();
        toast('Deleted successfully');
        render();
    });

    $(document).on('click', '[data-toggle-student]', function () {
        var s = byId(db.students, $(this).data('toggle-student'));
        s.status = s.status ? 0 : 1; save();
        toast(s.status ? 'Student activated' : 'Student blocked');
        render();
    });

    $(document).on('click', '[data-pay]', function () {
        var r = byId(db.issued, $(this).data('pay'));
        r.paid = true; save();
        toast('Demo payment of ' + r.fine + ' THB recorded (no real payment taken)');
        render();
    });

    $(document).on('input', '.table-search', function () {
        var q = this.value.toLowerCase();
        $(this).closest('.panel-body').find('tbody tr').each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(q) > -1);
        });
    });

    $(document).on('input', '#issue-sid', function () {
        var s = student(this.value.trim().toUpperCase());
        $('#student-lookup').html(s ? (s.status ? '<span class="text-success">' + esc(s.name) + '</span>' :
            '<span class="text-danger">' + esc(s.name) + ' is blocked</span>') : (this.value ? '<span class="text-danger">Invalid Student Id</span>' : ''));
    });

    $(document).on('input', '#issue-isbn', function () {
        var v = this.value.trim();
        var b = db.books.filter(function (x) { return x.isbn === v; })[0];
        $('#book-lookup').html(b ? (bookOnLoan(b.id) ? '<span class="text-danger">' + esc(b.name) + ' is already issued</span>' :
            '<span class="text-success">' + esc(b.name) + '</span>') : (v ? '<span class="text-danger">Invalid ISBN Number</span>' : ''));
    });

    $('#reset-demo').on('click', function (e) {
        e.preventDefault();
        storeDel(STORE_KEY);
        load();
        toast('Demo data reset');
        render();
    });

    $(window).on('hashchange', render);

    load();
    loadSession();
    render();
})();
