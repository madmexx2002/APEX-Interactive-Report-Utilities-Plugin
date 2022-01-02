/**
 * @function Call the related functions
 * @param {$(this)[0].action.affectedRegionId} p_affectedRegionId 
 * @param {Y or N} p_attrib1 
 * @param {Y or N} p_attrib2 
 * @param {HEX Color Code} p_attrib3 
 */
function caller(p_affectedRegionId, p_attrib1, p_attrib2, p_attrib3) {
    console.info('Interactive Report Util loaded for region: ' + p_affectedRegionId);
    if (p_attrib1 === 'Y') {
        HighlightSearch(p_affectedRegionId, p_attrib3);
    }
    if (p_attrib2 === 'Y') {
        Pagination(p_affectedRegionId);
    }
}

/**
 * @function HighlightSearch
 * @description  Highlight search for Interactive Report
 * @param p_InteractiveReport Interactive Report Static ID
 */
function HighlightSearch(p_InteractiveReport, p_Color) {
    // Create dynamic Keyup Handler
    $('#' + p_InteractiveReport).keyup(function (e) {
        if (e.target.id == p_InteractiveReport + '_search_field') {
            v_search = $('#' + p_InteractiveReport + '_search_field').val();
            v_search = v_search.toLowerCase();
            window[p_InteractiveReport + '_search'] = v_search;
            //console.log('HighlightSearch => ' + v_search);
            HighlightCell(p_InteractiveReport, window[p_InteractiveReport + '_search'], 'highlight-data');
        }
    });

    // Create Handler for AfterRefresh
    apex.jQuery('#' + p_InteractiveReport).on('apexafterrefresh', function () {
        console.log('apexafterrefresh => HighlightSearch');
        HighlightCell(p_InteractiveReport, window[p_InteractiveReport + '_search'], 'highlight-data');
    });

    // Create class for highlight style
    insertCSS('#' + p_InteractiveReport +' .highlight-data {background-color: ' + p_Color + '!important}');

    // Clear local globalThis
    window[p_InteractiveReport + '_search'] = null;
}

/**
 * @function Inject a CSS rule into the document
 * @param p_CSS 
 */
function insertCSS(p_CSS) {
    // Create a CSS Rule and add to the dom
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(p_CSS);
    console.log('insertCSS => ' + p_CSS);

}
/**
 * @function HighlightCell
 * @description Highlight Table
 */
function HighlightCell(p_Table, p_Search, p_Class) {
    console.log('HighlightCell => ' + p_Table);
    $('#' + p_Table + ' td').each(function () {
        // get the data from IR cell and make it to lower case
        cellData = $(this).text();
        cellData = cellData.toLowerCase();

        // search IR search field value with IR cell data
        cellData = cellData.search(p_Search);

        // if any match found in IR cells then add the class 
        if ((cellData != '-1' || cellData == 0) && p_Search != '') {
            $(this).closest('td').addClass(p_Class);
        }
        // if no match found in IR cells then remove the class
        else if (cellData == '-1') {
            $(this).closest('td').removeClass(p_Class);
        } else
            $(this).closest('td').removeClass(p_Class);
    });
}

/**
 * @function Pagination
 * @description Init createPagination event handlers
 * @param p_InteractiveReport Interactive Report Static ID
 */
function Pagination(p_InteractiveReport) {
    apex.jQuery(apex.gPageContext$).on("apexreadyend", function (e) {
        console.info('ApexReadyEnd');
        createPagination(p_InteractiveReport);
    });

    apex.jQuery("#" + p_InteractiveReport).on("apexafterrefresh", function () {
        console.info('apexafterrefresh');
        createPagination(p_InteractiveReport);
    });
}

/**
 * @function createPagination
 * @description  Create Buttons for pagination in the menubar for Interactive Report
 * @param p_InteractiveReport Interactive Report Static ID
 */
function createPagination(p_InteractiveReport) {
    console.info('createPagination');

    /* Place where the buttons will be created .a-IRR-buttons */
    let temp_target = '.a-IRR-actions';
    /* New Buttons */
    let temp_Button_prev = '<button class="t-Button t-Button--noLabel t-Button--icon t-Button--padLeft" onclick="void(0);" type="button" id="' + p_InteractiveReport + '_btn_prev" title="Previous Page" aria-label="Previous Page"><span class="t-Icon fa fa-chevron-left" aria-hidden="true"></span></button>';
    let temp_Button_next = '<button class="t-Button t-Button--noLabel t-Button--icon" onclick="void(0);" type="button" id="' + p_InteractiveReport + '_btn_next" title="Next Page" aria-label="Next Page"><span class="t-Icon fa fa-chevron-right" aria-hidden="true"></span></button>';
    /* Pagination Buttons */
//    let IR_Pagination_Next = '[aria-controls="' + p_InteractiveReport + '"][title="Next"],[aria-controls="' + p_InteractiveReport + '"][title="Weiter"]';
//    let IR_Pagination_Prev = '[aria-controls="' + p_InteractiveReport + '"][title="Previous"],[aria-controls="' + p_InteractiveReport + '"][title="Zurück"]';
    let IR_Pagination_Next = '#' + p_InteractiveReport + ' li.a-IRR-pagination-item:nth-child(3) button';
    let IR_Pagination_Prev = '#' + p_InteractiveReport + ' li.a-IRR-pagination-item:nth-child(1) button';
    console.log(IR_Pagination_Next);

    // Append Previous Button to dom
    $('#' + p_InteractiveReport + ' ' + temp_target).append(temp_Button_prev)

    // Add Click Handler
    $('#' + p_InteractiveReport + '_btn_prev').bind('click', function () {
        console.info('Button Previous');
        $(IR_Pagination_Prev).click();
    });

    // Disable Button if Previous Button isn't rendered
    if ($(IR_Pagination_Prev).length === 0) {
        apex.item(p_InteractiveReport + '_btn_prev').disable();
    }

    // Append Next Button to dom
    $('#' + p_InteractiveReport + ' ' + temp_target).append(temp_Button_next);

    // Add Click Handler
    $('#' + p_InteractiveReport + '_btn_next').bind('click', function () {
        console.info('Button Next');
        $(IR_Pagination_Next).click();
    });

    // Disable Button if Previous Button isn't rendered
    if ($(IR_Pagination_Next).length === 0) {
        apex.item(p_InteractiveReport + '_btn_next').disable();
    }
}