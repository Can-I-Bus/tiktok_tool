export default function useDrag(dragElRef, cb) {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        console.log(e, '=====');
        if (cb) cb(e);
    };

    const registerListeners = () => {
        const dragEl = dragElRef.value;
        if (dragEl) {
            console.log(dragEl);
            dragEl.addEventListener('dragover', handleDragOver);
            dragEl.addEventListener('drop', handleDrop);
        }
    };

    const unregisterListeners = () => {
        const dragEl = dragElRef.value;
        if (dragEl) {
            dragEl.removeEventListener('dragover', handleDragOver);
            dragEl.removeEventListener('drop', handleDrop);
        }
    };

    return { registerListeners, unregisterListeners };
}
