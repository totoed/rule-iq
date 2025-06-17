-- Add category column to existing questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing questions with categories based on their subjects
UPDATE questions SET category = CASE 
  WHEN subject = 'Dribbling' THEN 'Ball Handling'
  WHEN subject = 'Defense' THEN 'Defensive Play'
  WHEN subject = 'Footwork' THEN 'Movement'
  WHEN subject = 'Boundaries' THEN 'Court Rules'
  WHEN subject = 'Timeouts' THEN 'Game Management'
  WHEN subject = 'Fouls' THEN 'Penalties'
  WHEN subject = 'Traveling' THEN 'Movement'
  WHEN subject = 'Goaltending' THEN 'Defensive Play'
  WHEN subject = 'Violations' THEN 'Rule Violations'
  WHEN subject = 'Backcourt' THEN 'Court Rules'
  WHEN subject = 'Free Throws' THEN 'Shooting'
  WHEN subject = 'Inbounding' THEN 'Game Management'
  WHEN subject = 'Shot Clock' THEN 'Game Management'
  WHEN subject = 'Equipment' THEN 'Game Rules'
  WHEN subject = 'Passing' THEN 'Ball Handling'
  ELSE 'General'
END
WHERE category IS NULL;
