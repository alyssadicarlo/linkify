INSERT INTO users
    (first_name, last_name, email, password)
VALUES
    ('Master', 'User', 'masteruser@linkify.com', 'masterpass'),
    ('Logan', 'Cooper', 'logancooper@bellsouth.net', 'loganpass'),
    ('Alyssa', 'DiCarlo', 'alyssa.dicarlo@gmail.com', 'alyssapass'),
    ('Nate', 'Lee', 'nleepercussion@gmail.com', 'natepass');

INSERT INTO links
    (userID, uuid, custom_link, target_url)
VALUES
    (1, 'u7y6t5', NULL, 'www.digitalcrafts.com'),
    (1, 'q2w3e4', NULL, 'www.github.com'),
    (2, 'p0o9i8', 'logans_link', 'www.worldofwarcraft.com'),
    (3, 'r5t6y7', 'alyssas_link', 'https://georgiadogs.com/sports/softball'),
    (4, 'u8i9o0', 'nates_link', 'https://www.music.uga.edu/percussion');