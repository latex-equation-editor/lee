function onOpen() {
    const ui = DocumentApp.getUi();
    ui.createMenu('LaTeX Equation Editor')
        .addItem('Show Sidebar', 'showSidebar')
        .addToUi();
}

function showSidebar() {
    const sidebarHtml = HtmlService.createHtmlOutputFromFile('Sidebar')
        .setTitle('LaTeX Equation Editor (for docs)')
        .setWidth(300);
    DocumentApp.getUi().showSidebar(sidebarHtml);
}

function insertImage(dataUrl, adjustedWidth, adjustedHeight, altText) {
    // Decode the base64 image data to create a blob
    const imageBlob = Utilities.newBlob(Utilities.base64Decode(dataUrl.split(',')[1]), 'image/png');

    // Get the active document and its cursor position
    const doc = DocumentApp.getActiveDocument();
    const cursor = doc.getCursor();

    // Insert the image at the cursor's position or append at the document's end if no cursor found
    const image = cursor ? cursor.insertInlineImage(imageBlob) : doc.getBody().appendImage(imageBlob);
    const message = cursor ? "Image inserted at cursor." : "Image inserted at end of doc!";
    const color = cursor ? "blue" : "#8B8000";
    // Apply new dimensions and alt text to the inserted image
    image.setAltDescription(altText)
        .setWidth(adjustedWidth)
        .setHeight(adjustedHeight);
    return { success: true, status: message, color: color };
}

function getSelectedImageDescription() {
    const selection = DocumentApp.getActiveDocument().getSelection();

    if (!selection) {
        return { success: false, status: "Select a Latex image." };
    }

    const elements = selection.getRangeElements();

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i].getElement();

        if (element.getType() === DocumentApp.ElementType.INLINE_IMAGE) {
            const altText = element.asInlineImage().getAltDescription();
            return { success: true, value: altText };
        }
    }


    return { success: false, status: "Select a Latex image." };
}
