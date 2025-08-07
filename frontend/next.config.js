const path = require('path');

/** 
 * Configuración principal de Next.js, con alias para facilitar imports
*/
const nextConfig = {
  images: {
    unoptimized: true  // Desactiva optimización de imágenes (ajusta según necesidad)
  },
  webpack(config) {
    config.resolve.alias = {
      // Mantener posibles alias previos para no sobrescribirlos
      ...(config.resolve.alias || {}),

      /** Alias general '@' apuntando a la carpeta 'src' para importar '@/...' */
      '@': path.resolve(__dirname, 'src'),

      /** Alias específicos para los componentes UI en src/components/ui */
      '@radix-ui/react-accordion': path.resolve(__dirname, 'src/components/ui/accordion.tsx'),
      '@radix-ui/react-alert-dialog': path.resolve(__dirname, 'src/components/ui/alert-dialog.tsx'),
      '@radix-ui/react-alert': path.resolve(__dirname, 'src/components/ui/alert.tsx'),
      '@radix-ui/react-aspect-ratio': path.resolve(__dirname, 'src/components/ui/aspect-ratio.tsx'),
      '@radix-ui/react-avatar': path.resolve(__dirname, 'src/components/ui/avatar.tsx'),
      '@radix-ui/react-badge': path.resolve(__dirname, 'src/components/ui/badge.tsx'),
      '@radix-ui/react-breadcrumb': path.resolve(__dirname, 'src/components/ui/breadcrumb.tsx'),
      '@radix-ui/react-button': path.resolve(__dirname, 'src/components/ui/button.tsx'),
      '@radix-ui/react-calendar': path.resolve(__dirname, 'src/components/ui/calendar.tsx'),
      '@radix-ui/react-card': path.resolve(__dirname, 'src/components/ui/card.tsx'),
      '@radix-ui/react-carousel': path.resolve(__dirname, 'src/components/ui/carousel.tsx'),
      '@radix-ui/react-chart': path.resolve(__dirname, 'src/components/ui/chart.tsx'),
      '@radix-ui/react-checkbox': path.resolve(__dirname, 'src/components/ui/checkbox.tsx'),
      '@radix-ui/react-collapsible': path.resolve(__dirname, 'src/components/ui/collapsible.tsx'),
      '@radix-ui/react-command': path.resolve(__dirname, 'src/components/ui/command.tsx'),
      '@radix-ui/react-context-menu': path.resolve(__dirname, 'src/components/ui/context-menu.tsx'),
      '@radix-ui/react-dialog': path.resolve(__dirname, 'src/components/ui/dialog.tsx'),
      '@radix-ui/react-drawer': path.resolve(__dirname, 'src/components/ui/drawer.tsx'),
      '@radix-ui/react-dropdown-menu': path.resolve(__dirname, 'src/components/ui/dropdown-menu.tsx'),
      '@radix-ui/react-form': path.resolve(__dirname, 'src/components/ui/form.tsx'),
      '@radix-ui/react-hover-card': path.resolve(__dirname, 'src/components/ui/hover-card.tsx'),
      '@radix-ui/react-input-otp': path.resolve(__dirname, 'src/components/ui/input-otp.tsx'),
      '@radix-ui/react-input': path.resolve(__dirname, 'src/components/ui/input.tsx'),
      '@radix-ui/react-label': path.resolve(__dirname, 'src/components/ui/label.tsx'),
      '@radix-ui/react-menubar': path.resolve(__dirname, 'src/components/ui/menubar.tsx'),
      '@radix-ui/react-navigation-menu': path.resolve(__dirname, 'src/components/ui/navigation-menu.tsx'),
      '@radix-ui/react-pagination': path.resolve(__dirname, 'src/components/ui/pagination.tsx'),
      '@radix-ui/react-popover': path.resolve(__dirname, 'src/components/ui/popover.tsx'),
      '@radix-ui/react-progress': path.resolve(__dirname, 'src/components/ui/progress.tsx'),
      '@radix-ui/react-radio-group': path.resolve(__dirname, 'src/components/ui/radio-group.tsx'),
      '@radix-ui/react-resizable': path.resolve(__dirname, 'src/components/ui/resizable.tsx'),
      '@radix-ui/react-scroll-area': path.resolve(__dirname, 'src/components/ui/scroll-area.tsx'),
      '@radix-ui/react-select': path.resolve(__dirname, 'src/components/ui/select.tsx'),
      '@radix-ui/react-separator': path.resolve(__dirname, 'src/components/ui/separator.tsx'),
      '@radix-ui/react-sheet': path.resolve(__dirname, 'src/components/ui/sheet.tsx'),
      '@radix-ui/react-sidebar': path.resolve(__dirname, 'src/components/ui/sidebar.tsx'),
      '@radix-ui/react-skeleton': path.resolve(__dirname, 'src/components/ui/skeleton.tsx'),
      '@radix-ui/react-slider': path.resolve(__dirname, 'src/components/ui/slider.tsx'),
      '@radix-ui/react-sonner': path.resolve(__dirname, 'src/components/ui/sonner.tsx'),
      '@radix-ui/react-switch': path.resolve(__dirname, 'src/components/ui/switch.tsx'),
      '@radix-ui/react-table': path.resolve(__dirname, 'src/components/ui/table.tsx'),
      '@radix-ui/react-tabs': path.resolve(__dirname, 'src/components/ui/tabs.tsx'),
      '@radix-ui/react-textarea': path.resolve(__dirname, 'src/components/ui/textarea.tsx'),
      '@radix-ui/react-toast': path.resolve(__dirname, 'src/components/ui/toast.tsx'),
      '@radix-ui/react-toaster': path.resolve(__dirname, 'src/components/ui/toaster.tsx'),
      '@radix-ui/react-toggle-group': path.resolve(__dirname, 'src/components/ui/toggle-group.tsx'),
      '@radix-ui/react-toggle': path.resolve(__dirname, 'src/components/ui/toggle.tsx'),
      '@radix-ui/react-tooltip': path.resolve(__dirname, 'src/components/ui/tooltip.tsx'),
      '@radix-ui/react-use-mobile': path.resolve(__dirname, 'src/components/ui/use-mobile.tsx'),
      '@radix-ui/react-use-toast': path.resolve(__dirname, 'src/components/ui/use-toast.ts')
    };
    return config;
  }
};

module.exports = nextConfig;
