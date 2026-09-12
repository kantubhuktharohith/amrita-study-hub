-- Enhance handle_new_user to automatically capture Google avatar and name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    )
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = CASE 
      WHEN public.profiles.full_name = '' OR public.profiles.full_name IS NULL 
      THEN EXCLUDED.full_name 
      ELSE public.profiles.full_name 
    END,
    avatar_url = CASE 
      WHEN public.profiles.avatar_url = '' OR public.profiles.avatar_url IS NULL 
      THEN EXCLUDED.avatar_url 
      ELSE public.profiles.avatar_url 
    END;
  RETURN NEW;
END;
$$;
