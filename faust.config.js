import { setConfig } from "@faustwp/core";
import templates from "./src/wp-templates";
import possibleTypes from "./possibleTypes.json";

export default setConfig({
  templates,
  plugins: [],
  possibleTypes,
   // TAMBAHKAN ATAU MODIFIKASI BAGIAN INI
  menuLocations: [
    'PRIMARY', // Ini dari header
    'FOXIZ_MAIN', // Ini dari header
    'FOOTER_1', // <-- MENU BARU KITA
    'FOOTER_2'  // <-- MENU BARU KITA
     ],
});
