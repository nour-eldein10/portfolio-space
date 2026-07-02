-- Add project_id and rating to reviews table
ALTER TABLE public.reviews
ADD COLUMN project_id TEXT,
ADD COLUMN rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN helpful_count INTEGER DEFAULT 0;

-- Optional: index for faster lookups by project_id
CREATE INDEX idx_reviews_project_id ON public.reviews(project_id);
