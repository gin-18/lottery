<template>
  <div class="fixed bottom-8 right-8">
    <button class="btn" onclick="my_modal_2.showModal()">
      <span class="icon-[octicon--gear-24] text-xl"></span>
    </button>

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
