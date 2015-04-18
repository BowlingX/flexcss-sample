import Form from 'flexcss/src/main/Form';
import OffCanvas from 'flexcss/src/main/OffCanvas';
import Dropdown from 'flexcss/src/main/Dropdown';
import Settings from 'flexcss/src/main/util/Settings';
import Tooltip from 'flexcss/src/main/Tooltip';
import Modal from 'flexcss/src/main/Modal';

global.document.addEventListener('DOMContentLoaded', () => {
    "use strict";
    // Global setup, modal will update the scrollbars accordingly to prevent flickering the page
    Settings.setup({scrollbarUpdateNodes: [document.body, document.getElementById('Header')]});

    // Create of canvas navigation
    new OffCanvas('MainNavigation', 'ToggleMainNavigation', 'SidebarDarkener', -1);
    // init forms
    Form.init('form');

    // Some css relies on device detection, you may also use modernizr (http://modernizr.com/) for that
    // (but I build some feature-detection inside FlexCss)
    if (Settings.isTouchDevice()) {
        global.document.documentElement.classList.add('touch');
    }

    // All Components have a method `registerEvents` that will automatically set them up
    new Tooltip(document.documentElement).registerEvents();
    // init dropdowns, dropdowns behave differently on small screens, so we use a darkener here
    new Dropdown(document.documentElement, 'DropdownDarkener').registerEvents();
    // init modals
    new Modal(document.body).registerEvents();
});