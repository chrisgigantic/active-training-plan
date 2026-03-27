document.addEventListener('DOMContentLoaded', function () {
    const totalWeeksInput = document.getElementById('total-weeks');
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    // Selectors updated to classes
    const phase1Cell = document.getElementById('phase1-gpp');
    const phase2Cell = document.getElementById('phase2-spp');
    const phase3Cell = document.getElementById('phase3-comp');

    // Optimization: Cache redundant DOM queries
    const phase1Cells = document.querySelectorAll('.phase-1-cell');
    const phase2Cells = document.querySelectorAll('.phase-2-cell');
    const phase3Cells = document.querySelectorAll('.phase-3-cell');

    const calculateAndDisplayPlan = () => {
        const totalWeeks = parseInt(totalWeeksInput.value, 10);
        if (isNaN(totalWeeks) || totalWeeks < 7) {
            alert("Please enter a number of 7 or greater for the total weeks.");
            return;
        }

        // New logic based on periodization principles
        const p3_duration = Math.min(2, Math.round(totalWeeks * 0.25)); // Cap competition phase at 2 weeks or 25% for shorter plans
        const preparatoryPeriod = totalWeeks - p3_duration;
        const p1_duration = Math.round(preparatoryPeriod * 0.4);
        const p2_duration = preparatoryPeriod - p1_duration;

        const p1_end = p1_duration;
        const p2_start = p1_end + 1;
        const p2_end = p2_start + p2_duration - 1;
        const p3_start = p2_end + 1;
        const p3_end = totalWeeks;

        // Update all cells for each phase
        phase1Cells.forEach(el => {
            el.innerHTML = `<strong>P1: GPP</strong> (Wk 1-${p1_end})`;
        });
        phase2Cells.forEach(el => {
            el.innerHTML = `<strong>P2: SPP</strong> (Wk ${p2_start}-${p2_end})`;
        });
        phase3Cells.forEach(el => {
            el.innerHTML = `<strong>P3: Competition</strong> (Wk ${p3_start}-${p3_end})`;
        });
    };

    generatePlanBtn.addEventListener('click', calculateAndDisplayPlan);
    // Initial calculation on page load
    calculateAndDisplayPlan();

    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-body-content');
    const closeButton = document.querySelector('.close-button');
    const tableContainer = document.querySelector('.table-container');
    const contentCache = {};

    // Function to open the modal and fetch content
    const openModal = (cell) => {
        const fileName = cell.getAttribute('data-details-file');
        if (!fileName) return;

        if (contentCache[fileName]) {
            modalBody.innerHTML = contentCache[fileName];
            modal.style.display = 'block';
            return;
        }

        const filePath = `details-v2/${fileName}`;

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(markdown => {
                const html = marked.parse(markdown);
                contentCache[fileName] = html;
                modalBody.innerHTML = html;
                modal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching details:', error);
                modalBody.innerHTML = `<p>Could not load details. Please ensure the file <code>${filePath}</code> exists.</p>`;
                modal.style.display = 'block';
            });
    };

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
        modalBody.innerHTML = ''; // Clear content
    };

    // Event listener for table clicks
    if (tableContainer) {
        tableContainer.addEventListener('click', function (event) {
            const targetCell = event.target.closest('td');
            if (targetCell && targetCell.hasAttribute('data-details-file')) {
                openModal(targetCell);
            }
        });
    }

    // Event listener for the close button
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Event listener to close modal when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});
