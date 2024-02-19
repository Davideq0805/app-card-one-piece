// Umbral de decisión para determinar si se realiza una acción al soltar la tarjeta
const DECISION_THRESHOLD = 80;
// Bandera para indicar si la animación está en curso
let isAnimating = false;
// Distancia que la tarjeta se está arrastrando
let pullDeltaX = 0;

// Función para iniciar el arrastre
function startDrag(event) {
    // Si ya hay una animación en curso, salimos de la función
    if (isAnimating) return;

    // Obtener la tarjeta actual que se está arrastrando
    const actualCard = event.target.closest('article');

    // Obtener la posición inicial del mouse o dedo
    const startX = event.pageX ?? event.touches[0].pageX;

    // Escuchar los movimientos del mouse y del dedo
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd, { passive: true });

    // Función para manejar el movimiento
    function onMove(event) {
        // Obtener la posición actual del mouse o dedo
        const currentX = event.pageX ?? event.touches[0].pageX;
        // Calcular la distancia entre la posición inicial y la actual
        pullDeltaX = currentX - startX;
        
        // Si no hay distancia recorrida, salimos de la función
        if (pullDeltaX === 0) return;

        // Cambiar la bandera para indicar que estamos animando
        isAnimating = true;

        // Calcular la rotación de la tarjeta usando la distancia
        const deg = pullDeltaX / 15;

        // Aplicar la transformación a la tarjeta
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

        // Cambiar el cursor a "grabbing" (agarrando)
        actualCard.style.cursor = 'grabbing';
    }

    // Función para manejar el final del arrastre
    function onEnd(event) {
        // Dejar de escuchar los movimientos del mouse y del dedo
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        // Determinar si se tomó una decisión basada en la distancia recorrida
        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

        if (decisionMade) {
            // Determinar la dirección en función de la distancia recorrida
            const goRight = pullDeltaX >= 0;
            const goLeft = !goRight;

            // Agregar la clase según la decisión tomada
            actualCard.classList.add(goRight ? 'go-right' : 'go-left');

            // Escuchar el evento de final de transición para eliminar la tarjeta
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove();
            }, { once: true });
        } else {
            // Si no se tomó una decisión, restaurar la posición original de la tarjeta
            actualCard.classList.add('reset');
            actualCard.classList.remove('go-right', 'go-left');
        }

        // Restablecer las variables después de la animación
        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style');
            actualCard.classList.remove('reset');

            pullDeltaX = 0;
            isAnimating = false;
        });
    }
}

// Escuchar el evento de clic del mouse para iniciar el arrastre
document.addEventListener('mousedown', startDrag);

// Escuchar el evento de inicio de toque para iniciar el arrastre en dispositivos táctiles
document.addEventListener('touchstart', startDrag, { passive: true });
