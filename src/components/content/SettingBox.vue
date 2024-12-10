<template>
  <div>
    <button
      class="icon-[octicon--gear-24]"
      onclick="my_modal_2.showModal()"
    ></button>

    <dialog id="my_modal_2" class="modal">
      <div class="modal-box">
        <slot></slot>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
