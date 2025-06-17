-- Add new basketball questions to the questions table
INSERT INTO public.questions (text, correct_answer, subject)
VALUES
('Is it legal to touch the ball while it is on the rim?', false, 'Goaltending'),
('Can a player call a timeout while in the air?', false, 'Timeouts'),
('Is it legal to dribble, stop, and then dribble again?', false, 'Dribbling'),
('Can a defensive player take a charge inside the restricted area?', false, 'Defense'),
('Is it legal to jump while inbounding the ball?', false, 'Boundaries'),
('Can a player touch the ball before it crosses half court on a throw-in?', true, 'Boundaries'),
('Is it legal to block a shot after it starts its downward flight?', false, 'Goaltending'),
('Can a player step on the sideline while catching a pass?', false, 'Boundaries'),
('Is it legal to call a timeout while the ball is loose?', false, 'Timeouts'),
('Can a player receive a technical foul while on the bench?', true, 'Fouls');