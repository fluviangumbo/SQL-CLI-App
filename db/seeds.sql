INSERT INTO departments (name)
VALUES ('Operations'), ('Sales'), ('Engineering');

INSERT INTO roles (title, salary, department_id)
VALUES  ('VP of Operations', 120000, 1),
        ('Operations Manager', 95000, 1),
        ('Technician', 75000, 1),
        ('VP of Sales', 120000, 2),
        ('Sales Manager', 80000, 2),
        ('Senior Business Development Representative', 55000, 2),
        ('Business Development Representative', 50000, 2),
        ('VP of Engineering', 130000, 3),
        ('Team Lead', 105000, 3),
        ('Tier II Engineer', 90000, 3),
        ('Tier I Engineer', 70000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('Tim', 'Waldorf', 4, NULL),
        ('James', 'Spenzer', 1, NULL),
        ('Casey', 'Monticello', 8, NULL),
        ('Albert', 'Amirola', 2, 2),
        ('Sam', 'Curtis', 3, 4),
        ('David', 'Burgess', 3, 4),
        ('Will', 'Gaines', 5, 1),
        ('Gordon', 'Durkle', 6, 7),
        ('Tim', 'Barzetti', 6, 7),
        ('Stan', 'Mirkus', 7, 8),
        ('Dan', 'Finkle', 7, 8),
        ('Kurt', 'Mosby', 7, 9),
        ('Wanda', 'Lively', 7, 9),
        ('Steve', 'Schmidt', 9, 3),
        ('Jeff', 'Leland', 9, 3),
        ('Tony', 'Vittori', 10, 14),
        ('Kim', 'Youngkin', 10, 15),
        ('Sara', 'Hardy', 11, 16),
        ('Pat', 'Drummond', 11, 17);