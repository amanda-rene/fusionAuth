/*
 * Copyright (c) 2024, FusionAuth, All Rights Reserved
 */
'use strict';

/**
* @author David Charles
*/
class ActionMenu {
  #direction = {
    next: 'next',
    previous: 'previous'
  }

  /**
    * @constructor
    *
    * Initialize and handle the action menu dropdown
    */
  constructor() {
    // Bind a click and key down handler to the document during the capture phase. This means these handlers
    // are invoked during capture, which comes before bubble. This way we can do some work before anyone else
    // that may be binding to these events during the bubble phase.
    //
    //         Capture-->   | |  / \   <--- Bubble
    //     -----------------| |--| |-----------------
    //     | element1       | |  | |                |
    //     |   -------------| |--| |-----------     |
    //     |   |element2    \ /  | |          |     |
    //     |   --------------------------------     |
    //     |        W3C event model                 |
    //     ------------------------------------------
    //
    // See https://www.quirksmode.org/js/events_order.html#link4
    //
    const options = {
      capture: true,
    };
    document.addEventListener('click', event => this.#handleClick(event), options);
    document.addEventListener('keydown', event => this.#handleKeyDown(event), options);
  }

  #closeActionMenus(event) {
    document.querySelectorAll('.action-menu').forEach(element => {
      // Close when:
      //  1. The event is null. This means close everything w/out prejudice.
      //  2. The event is coming from a menu item anchor tag
      //  3. The click is from an action menu, but not the one closest to the event target.
      //
      // Note this processes all action-menu items on the page even if they are already closed. This is done for
      // simplicity.
      if (event === null || event.target.matches('.menu-items a') || element !== event.target.closest('.action-menu')) {
        element.querySelector('.menu-items').classList.add('hidden');
        element.querySelector('button i').classList.remove('open');
      }
    });
  }

  #getActionMenuElements(element) {
    const actionMenu = element.closest('.action-menu');
    if (actionMenu == null) {
      return null;
    }

    return {
      actionMenu: actionMenu,
      button: actionMenu.querySelector('button'),
      icon: actionMenu.querySelector('button i'),
      menuItems: actionMenu.querySelector('.menu-items')
    };
  }

  #handleClick(event) {
    const actionMenu = this.#getActionMenuElements(event.target);
    const button = event.target.closest('button');
    const buttonClicked = button != null;

    this.#closeActionMenus(event);

    if (actionMenu != null && buttonClicked) {
      actionMenu.icon.classList.toggle('open');
      actionMenu.menuItems.classList.toggle('hidden');
      // If the menu is no longer hidden, but partially hidden due to the view height, move it up.
      if (!actionMenu.menuItems.classList.contains('hidden')) {
        if (!this.#isMenuVisible(actionMenu.menuItems)) {
          actionMenu.menuItems.style.bottom = button.getBoundingClientRect().height + 'px';
        }
      }
    }
  }

  #handleKeyDown(event) {
    // Close all action menus
    if (event.key === 'Escape') {
      this.#closeActionMenus(null);
      return;
    }

    // If this is not an ArrowDown or ArrowUp key, then bail early, there is no additional work to do.
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }

    // Handle up and down arrow keys to set focus.
    const actionMenu = this.#getActionMenuElements(event.target);
    if (actionMenu != null && !actionMenu.menuItems.classList.contains('hidden')) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.#highlightMenuItem(actionMenu.menuItems, this.#direction.next)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.#highlightMenuItem(actionMenu.menuItems, this.#direction.previous)
      }
    }
  }

  #highlightMenuItem(menu, direction) {
    const actions = Array.from(menu.getElementsByTagName('li'));
    const currentFocus = menu.querySelector('li a:focus')

    // If nothing has been highlighted yet, get things started by highlighting the first item
    if (currentFocus == null) {
      menu.querySelector(':first-child a').focus();
      return;
    }

    const itemIndex = actions.indexOf(currentFocus.parentElement)
    if (direction === this.#direction.next) {
      if (itemIndex < actions.length - 1) {
        let item = actions.at(itemIndex)
        item.nextElementSibling.querySelector(':first-child').focus();
      }
    } else {
      if (itemIndex !== 0) {
         let item = actions.at(itemIndex)
         item.previousElementSibling.querySelector(':first-child').focus();
      }
    }
  }

  #isMenuVisible(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

document.addEventListener('DOMContentLoaded', () => new ActionMenu());
