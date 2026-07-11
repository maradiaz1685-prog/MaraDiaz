<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Alcance: solo esta carpeta

Este repo (`C:\maradiaz`) es un proyecto de cliente independiente. Cuando se trabaja acá:

- No leer, editar ni operar sobre archivos de otras carpetas de proyecto del usuario (`C:\ofertas locales`, `C:\rifalocal`, `C:\descuentolocal`, `C:\pinogalant`, `C:\tiendalopez`, `C:\localwebone`, `C:\InfernoHost`, etc.). Cada carpeta es un sitio/cliente distinto con su propio repo — no mezclar.
- **git push de este repo NO se puede hacer desde una sesión de Claude Code cuyo working directory principal es otra carpeta.** El clasificador de seguridad resuelve el push contra el repo del working directory principal de la sesión, no contra el remote real configurado acá — el push queda bloqueado con un falso "repo mismatch" sin importar la cuenta de GitHub logueada. Esto ya se probó varias veces (2026-07-11) y no tiene solución re-logueando cuentas: `gh auth login` corrido desde el Bash tool de Claude Code actualiza credenciales en un entorno/keyring separado del perfil real de Windows del usuario, así que tampoco sirve para arreglar el push manual del usuario.
- **Para pushear:** el usuario tiene que correr `git push` él mismo, desde su propia terminal en su perfil real de Windows (hay accesos directos en su escritorio: "Subir MaraDiaz.bat" y "Login GitHub MaraDiaz.bat"). Si el push da 403 de permisos, el problema típico es que el navegador donde completó el login de `gh auth login --web` ya estaba logueado en GitHub con la cuenta equivocada — tiene que loguearse ahí específicamente como `maradiaz1685-prog` (cerrar sesión de la otra cuenta o usar una ventana privada), no alcanza con volver a correr el comando.

