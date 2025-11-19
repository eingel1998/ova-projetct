-- Función SQL simple para que admins cambien contraseñas
-- Ejecuta esto en Supabase SQL Editor

CREATE OR REPLACE FUNCTION admin_update_user_password(
  user_id UUID,
  new_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Verificar que quien llama es admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo administradores pueden cambiar contraseñas';
  END IF;

  -- Validar contraseña
  IF LENGTH(new_password) < 6 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 6 caracteres';
  END IF;

  -- Actualizar contraseña en auth.users
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_password, gen_salt('bf')),
    updated_at = NOW()
  WHERE id = user_id;

  -- Verificar que se actualizó
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  result := json_build_object(
    'success', true,
    'message', 'Contraseña actualizada correctamente'
  );

  RETURN result;
END;
$$;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION admin_update_user_password(UUID, TEXT) TO authenticated;
