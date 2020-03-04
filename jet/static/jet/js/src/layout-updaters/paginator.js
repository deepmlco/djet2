const $ = require('jquery');

const PaginatorUpdater = function ($paginator) {
    this.$paginator = $paginator;
};

PaginatorUpdater.prototype = {
    removeSpacesBetweenPages: function () {
        this.$paginator.contents().each(function () {
            if (this.nodeType !== 3) {
                return;
            }

            const $node = $(this);

            if (($node.prev().prop('tagName') === 'A' || $node.prev().prop('tagName') === 'SPAN')
                && ($node.next().prop('tagName') === 'A' || $node.next().prop('tagName') === 'SPAN')) {

                if (['...', '…'].includes($.trim($node.text()))) {
                    $node.wrap($('<span>').addClass('disabled'));
                } else if ($.trim($node.text()) === '') {
                    $node.remove();
                }
            }
        });
    },
    wrapPages: function () {
        let foundPage = false;
        let pagesEnded = false;
        let $pageNodes = $([]);

        this.$paginator.contents().each(function () {
            const $node = $(this);
            const pageNode = (this.tagName === 'A' && !$node.hasClass('showall')) || this.tagName === 'SPAN';

            if (pageNode) {
                foundPage = true;
            }

            if (!foundPage) {
                return;
            }

            if (pageNode && !pagesEnded) {
                $node.detach();
                $pageNodes = $pageNodes.add($node);
            } else {
                pagesEnded = true
            }
        });

        this.$paginator.prepend($('<span>').addClass('pages-wrapper').append($pageNodes));
    },
    wrapTextNodes: function () {
        let foundPage = false;
        let $nodes = $([]);

        this.$paginator.contents().each(function () {
            const $node = $(this);
            const pageNode = (this.tagName === 'A' && !$node.hasClass('showall')) || this.tagName === 'SPAN';

            if (pageNode) {
                foundPage = true;
            } else if (foundPage && !pageNode && this.tagName !== 'INPUT') {
                $node.detach();
                $nodes = $nodes.add($node);
            }
        });

        $('<div>')
            .addClass('label')
            .append($nodes)
            .appendTo(this.$paginator);
    },
    run: function () {
        try {
            this.removeSpacesBetweenPages();
            this.wrapPages();
            this.wrapTextNodes();
        } catch (e) {
            console.error(e, e.stack);
        }

        this.$paginator.addClass('initialized');
    }
};

$(document).ready(function () {
    $('.paginator').each(function () {
        new PaginatorUpdater($(this)).run();
    });
});
