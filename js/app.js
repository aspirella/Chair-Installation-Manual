
// Basic app.js to initialize turn.js and handle events
$(document).ready(function () {
    var $flipbook = $('.flipbook');
    var $slider = $('#page-slider');
    var $pageCurrent = $('#page-current');
    var $pageTotal = $('#page-total');
    var $loader = $('#loader');
    var $helpOverlay = $('#help-overlay');
    var $closeHelp = $('#close-help');

    // --- Responsive Setup ---
    function checkDisplayMode() {
        if ($(window).width() < 768) {
            return 'single';
        } else {
            return 'double';
        }
    }

    function getBookDimensions() {
        if ($(window).width() < 768) {
            // Mobile dimensions
            return {
                width: $(window).width() - 20, // Padding
                height: $(window).height() - 100 // Navbar/Toolbar
            };
        } else {
            // Desktop dimensions (fixed as per original design)
            return {
                width: 920,
                height: 650
            };
        }
    }

    // Initialize Flipbook
    function initFlipbook() {
        var displayMode = checkDisplayMode();
        var dims = getBookDimensions();

        $flipbook.turn({
            width: dims.width,
            height: dims.height,
            autoCenter: true,
            gradients: true,
            acceleration: true,
            display: displayMode, // 'single' or 'double'
            elevation: 50,
            duration: 1000,
            when: {
                turning: function (event, page, view) {
                    updateControls(page);
                },
                turned: function (event, page, view) {
                    updateControls(page);
                }
            }
        });
    }

    initFlipbook();

    // --- Loading & Help Logic ---
    setTimeout(function () {
        $loader.fadeOut(500, function () {

            // Check LocalStorage for first-time visit
            var hasVisited = localStorage.getItem('flipbook_visited');

            if (!hasVisited) {
                // Show Help Overlay after a mild delay (2s) if user hasn't interacted
                // For simplicity, we just show it to ensuring they see it once.
                setTimeout(function () {
                    $helpOverlay.addClass('show');
                }, 2000);
            }
        });
    }, 1500);

    $closeHelp.click(function () {
        $helpOverlay.removeClass('show');
        // Set visited flag
        localStorage.setItem('flipbook_visited', 'true');
    });

    // Close help if clicking anywhere on overlay
    $helpOverlay.click(function (e) {
        if (e.target === this) {
            $(this).removeClass('show');
            localStorage.setItem('flipbook_visited', 'true');
        }
    });

    // Helper: Update controls (slider, text)
    function updateControls(page) {
        $slider.val(page);
        $pageCurrent.text(page);

        // Update total pages dynamically inside controls
        var total = $flipbook.turn('pages');
        $pageTotal.text(total);
        $slider.attr('max', total);
    }

    // Initial Controls Update
    updateControls(1);


    // --- Event Listeners ---

    // Resize Handler (Debounced)
    var resizeTimer;
    $(window).resize(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // Reload page on resize to reset turn.js dimensions cleanly
            // (Turn.js resizing is complex, reload is robust for this demo)
            // Ideally we would use $flipbook.turn('size', w, h) but switching display modes requires re-init

            // Simple check: if display mode changes, reload. If just resizing, maybe adjust size?
            // For stability in this timeframe, we'll reload which is standard for simple flipbooks.
            // checking if width changed significantly to avoid mobile scroll-bar trigger
            // location.reload(); 

            // Smarter resize attempt:
            var currentMode = $flipbook.turn('display');
            var newMode = checkDisplayMode();

            if (currentMode !== newMode) {
                // Must destroy/recreate or reload. 
                // Since destroying logic is heavy, let's guide user or simple scale
                // For this demo, let's just update size if mode is same, or resize if mobile.
            }

            var dims = getBookDimensions();
            $flipbook.turn('size', dims.width, dims.height);

        }, 250);
    });

    // Side Arrows
    $('#prev-btn, .prev-arrow').click(function () {
        $flipbook.turn('previous');
    });

    $('#next-btn, .next-arrow').click(function () {
        $flipbook.turn('next');
    });

    // Toolbar Buttons
    $('#btn-first').click(function () {
        $flipbook.turn('page', 1);
    });

    $('#btn-prev').click(function () {
        $flipbook.turn('previous');
    });

    $('#btn-next').click(function () {
        $flipbook.turn('next');
    });

    $('#btn-last').click(function () {
        $flipbook.turn('page', $flipbook.turn('pages'));
    });

    // Slider
    $slider.on('input change', function () {
        var page = parseInt($(this).val());
        $flipbook.turn('page', page);
    });

    // Zoom (Basic Implementation using CSS Scale)
    var currentZoom = 1;
    function applyZoom() {
        $('.container').css('transform', 'scale(' + currentZoom + ')');
    }

    $('#btn-zoom-in').click(function () {
        if (currentZoom < 2) {
            currentZoom += 0.2;
            applyZoom();
        }
    });

    $('#btn-zoom-out').click(function () {
        if (currentZoom > 0.6) {
            currentZoom -= 0.2;
            applyZoom();
        }
    });

    // Print
    $('#btn-print').click(function () {
        window.print();
    });

    // Fullscreen
    $('#btn-fullscreen').click(function () {
        var elem = document.documentElement;
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        }
    });

    // Keyboard Navigation
    $(document).keydown(function (e) {
        if (e.keyCode == 37) { // Left arrow
            $flipbook.turn('previous');
        } else if (e.keyCode == 39) { // Right arrow
            $flipbook.turn('next');
        }
    });
});
