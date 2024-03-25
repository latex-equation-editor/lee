function onOpen() {
    const ui = SlidesApp.getUi();
    ui.createMenu('LaTeX Equation Editor')
        .addItem('Show Sidebar', 'showSidebar')
        .addToUi();
}

function showSidebar() {
    const sidebarHtml = HtmlService.createHtmlOutputFromFile('Sidebar')
        .setTitle('LaTeX Equation Editor')
        .setWidth(300);
    SlidesApp.getUi().showSidebar(sidebarHtml);
}

function insertImage(dataUrl, adjustedWidth, adjustedHeight, altText) {
    var slide = SlidesApp.getActivePresentation().getSelection().getCurrentPage();
    if (slide && slide.getPageType() === SlidesApp.PageType.SLIDE) {
        // Decode the base64 image data to create a blob
        const imageBlob = Utilities.newBlob(Utilities.base64Decode(dataUrl.split(',')[1]), 'image/png');

        const image = slide.insertImage(imageBlob);
        image.setWidth(adjustedWidth);
        image.setHeight(adjustedHeight);
        image.setDescription(altText);

        return { success: true, color: 'blue', status: 'Image inserted at the top left.' };
    }
    return { success: false, error: "No slide selected" };
}

function getSelectedImageDescription() {
    const selection = SlidesApp.getActivePresentation().getSelection();

    if (!selection) {
        return { success: false, error: "No image selected!" };
    }

    if (selection.getSelectionType() === SlidesApp.SelectionType.PAGE_ELEMENT) {

        const elements = selection.getPageElementRange().getPageElements();

        // Iterate over selected elements
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            // Check if the element is an image
            if (element.getPageElementType() === SlidesApp.PageElementType.IMAGE) {
                const altText = element.asImage().getDescription();
                return { success: true, value: altText };
            }
        }
        return { success: false, error: "Selection is not an image!" };
    }

    return { success: false, error: "No image selected!" };
}

