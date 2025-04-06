export default function Footer() {
    return (
      <footer className="bg-white dark:bg-gray-950 border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.</p>
        </div>
      </footer>
    )
  }