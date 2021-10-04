import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import usePluginImport from 'vite-plugin-importer';
import vars from '@components/vars';

const online = true;

// https://github.com/ajuner/vite-plugin-importer#use
const AntDesignImporterConfig = usePluginImport({
  libraryName: "antd",
  libraryDirectory: "es",
  style: true,
});

const BaizhunImporterConfig = usePluginImport({
  libraryName: "@components/common",
  libraryDirectory: "es",
  style: true,
});

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.less', '.css'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: vars
      },
    }
  },
  plugins: [reactRefresh(), AntDesignImporterConfig, BaizhunImporterConfig],
  server: {
    proxy: {
      '/micro': {
        changeOrigin: true,
        target: online ? 'http://api.znrank.com' : 'http://192.168.31.202:8000',
        headers: {
          'xc-token': online ? 'f7e48d92-a27d-4a84-a111-1702ae9a0490' : '035fba9e-5b69-332e-afdc-b6e79fff2bcd',
        }
      }
    }
  }
})
