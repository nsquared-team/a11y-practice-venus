/**
 * Discover Venus — Overlay Test Scoresheet builder (Google Apps Script)
 * =====================================================================
 * Builds a formatted Google Sheet for the UserWay-overlay-vs-baseline
 * accessibility comparison, ready to fill in live during the demo.
 *
 * HOW TO USE
 *   1. Create a new blank Google Sheet (sheets.new).
 *   2. Extensions ▸ Apps Script.
 *   3. Delete the placeholder code, paste this whole file, Save.
 *   4. Pick `buildOverlayTestSheet` in the function dropdown, click Run.
 *   5. Authorize when prompted (first run only), then switch back to the Sheet.
 *
 * Re-running rebuilds both tabs from scratch (it deletes and recreates them),
 * so don't put data you want to keep in the "Scoresheet"/"Regression" tabs.
 *
 * Baseline = https://discovervenus.site/   (no widget — the control)
 * Overlay  = https://discovervenus.site/overlay-test/   (UserWay installed)
 * Note: most issues are gated behind the issues toggle (on by default;
 * press Ctrl+Shift+A to re-enable if you turned it off in that browser).
 */

// Verdict options + colors (Fixed = genuinely helps AT, Masked = visual/UI
// only, Not fixed = unchanged, Worse = overlay introduced a new problem).
var VERDICTS = ['Fixed', 'Masked', 'Not fixed', 'Worse', 'Not tested'];
var VERDICT_COLORS = {
  'Fixed': '#b7e1cd',      // green
  'Masked': '#fce8b2',     // amber
  'Not fixed': '#f4c7c3',  // red
  'Worse': '#e6a0a0',      // darker red
  'Not tested': '#efefef'  // grey
};

// One row per issue: [#, Principle, Issue, WCAG, Where, Prediction, Notes]
var ISSUES = [
  ['1a', 'Perceivable',   'Empty alt (alt="") on informative gallery image', '1.1.1 (A)',  'destination-detail.html — 3rd gallery/lightbox image', '🟡 Verify',   'alt="" is PRESENT (a decorative declaration), so overlays/scanners usually skip it even though the image is informative. Does UserWay add alt anyway? (Likely not — confirms the theory.)'],
  ['1b', 'Perceivable',   'Alt attribute missing entirely (content image)', '1.1.1 (A)',  'about.html — Dr. Elena Vasquez team photo', '🟡 Verify',   'alt removed completely. Baseline: a screen reader reads the filename. Does UserWay AI inject an alt — and is it useful, generic, or wrong?'],
  [2,  'Perceivable',    'Low-contrast hero text', '1.4.3 (AA)', 'index.html hero', '🟢 Likely',   'Only after enabling the contrast profile? Check ratio with the widget closed vs. open.'],
  [3,  'Perceivable',    'Low-contrast modal close button', '1.4.3 (AA)', 'modal dialogs', '🟢 Likely',   'Does the contrast profile reach this control?'],
  [4,  'Perceivable',    'Color-only error indicators', '1.4.11 (AA)', 'booking.html — Primary Destination (step 1) & Email (step 2)', '🔴 Unlikely', 'Red border, no text/aria. Overlay cannot add a text/icon error cue.'],

  [5,  'Operable',       'Modal Escape key disabled', '2.1.1 (A)', 'index.html "See More" modal', '🔴 Unlikely', 'Always active (not toggle-gated). Open the hero modal, press Esc — it will not close.'],
  [6,  'Operable',       'Hidden carousel slides still focusable', '2.1.1 (A)', 'index.html carousel', '🔴 Unlikely', 'Tab past the visible slide into off-screen "Explore" links. Slides are aria-hidden too.'],
  [7,  'Operable',       'Modal focus trap disabled', '2.1.2 (A)', 'destination-detail lightbox', '🔴 Unlikely', 'Tab should escape to the page behind the dialog.'],
  [8,  'Operable',       'Auto-play carousel, no pause', '2.2.2 (A)', 'index.html Featured Destinations', '🟡 Verify',   'Does UserWay\'s "pause animations" actually stop this carousel?'],
  [9,  'Operable',       'Non-functional skip link', '2.4.1 (A)', 'all pages', '🔴 Unlikely', 'Overlay may add its own nav, but does the page\'s own skip link work?'],
  [10, 'Operable',       'Vague "Edit" link text', '2.4.4 (A)', 'booking.html review step', '🔴 Unlikely', 'Overlay will not rewrite link text meaningfully.'],
  [11, 'Operable',       'Vague carousel nav labels', '2.4.4 (A)', 'index.html carousel', '🔴 Unlikely', '"Previous"/"Next" lack context.'],
  [12, 'Operable',       'No visible focus indicator', '2.4.7 (AA)', '"See More" button + "Beta Regio" card (homepage)', '🟡 Verify',   'Some overlays add a focus highlight — does it appear on these elements?'],
  [13, 'Operable',       'Small touch targets (20px)', '2.5.5 / 2.5.8', 'homepage footer social icons', '🔴 Unlikely', 'Bigger-text/cursor will not enlarge the actual hit area.'],

  [14, 'Understandable', 'Placeholder-only, no real labels', '3.3.2 / 3.2.2 (A)', 'index.html reservation form', '🟡 Verify',   'Does the overlay add programmatic labels, or just leave placeholders?'],
  [15, 'Understandable', 'Errors not associated with inputs', '3.3.1 (A)', 'booking.html validation', '🔴 Unlikely', 'No aria-describedby link — does AT announce the error on focus?'],
  [16, 'Understandable', 'Labels not associated with fields', '3.3.2 (A)', 'booking.html — Primary Destination select', '🟡 Verify',   'Visible label present but no for/id. Check association after overlay loads.'],
  [17, 'Understandable', 'Checkbox group, no fieldset/legend', '3.3.2 (A)', 'booking.html dietary/add-on groups', '🔴 Unlikely', 'Individual boxes are labelled; the group is not named.'],

  [18, 'Robust',         'Lightbox dialog missing aria-labelledby (no accessible name)', '4.1.2 (A)', 'destination-detail lightbox', '🟡 Verify', 'The only modal lacking a name — the homepage modal has a valid one. Does AI remediation name the dialog?'],
  [19, 'Robust',         'Close button missing aria-label', '4.1.2 (A)', 'destination-detail lightbox close (×)', '🟡 Verify', 'Icon-only button. WATCH: overlay may inject aria-label="times" — technically a name, but useless.'],
  [20, 'Robust',         'Carousel changes not announced', '4.1.3 (AA)', 'index.html carousel', '🔴 Unlikely', 'No live region — slide changes are silent to AT.'],
  [21, 'Robust',         'Lightbox counter not in live region', '4.1.3 (AA)', 'destination-detail lightbox', '🔴 Unlikely', '"Image X of Y" updates visually only.']
];

// Overlay's own footprint — does the widget introduce new problems?
var REGRESSION_CHECKS = [
  'Is the UserWay trigger button keyboard-reachable and operable?',
  'Does the widget panel trap focus correctly / close on Esc?',
  'Does it add duplicate or competing landmarks/roles?',
  'Does it steal or mis-manage focus on load?',
  'Render-blocking impact of the <head> script (Lighthouse perf / LCP)?',
  'Does it interfere with the real screen-reader output (double-speak)?'
];

function buildOverlayTestSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  buildScoresheet_(ss);
  buildRegression_(ss);
  SpreadsheetApp.getUi().alert('Done — see the "Scoresheet" and "Regression" tabs.');
}

function buildScoresheet_(ss) {
  var name = 'Scoresheet';
  var old = ss.getSheetByName(name);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(name, 0);

  var headers = ['#', 'Principle', 'Issue', 'WCAG', 'Where', 'Prediction',
                 'Baseline (no widget)', 'With overlay', 'Verdict', 'Notes'];
  var nCols = headers.length;

  // Title row
  sh.getRange(1, 1, 1, nCols).merge()
    .setValue('Discover Venus — UserWay Overlay vs. Baseline Scoresheet')
    .setFontSize(14).setFontWeight('bold')
    .setBackground('#1f3864').setFontColor('#ffffff')
    .setHorizontalAlignment('left').setVerticalAlignment('middle');
  sh.setRowHeight(1, 34);

  // Header row
  sh.getRange(2, 1, 1, nCols).setValues([headers])
    .setFontWeight('bold').setBackground('#d9e1f2')
    .setVerticalAlignment('middle').setWrap(true);

  // Data
  var rows = ISSUES.map(function(r) {
    return [r[0], r[1], r[2], r[3], r[4], r[5], '', '', 'Not tested', r[6]];
  });
  var firstDataRow = 3;
  sh.getRange(firstDataRow, 1, rows.length, nCols).setValues(rows)
    .setVerticalAlignment('top').setWrap(true);

  var lastDataRow = firstDataRow + rows.length - 1;

  // Verdict dropdown
  var verdictRange = sh.getRange(firstDataRow, 9, rows.length, 1);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(VERDICTS, true).setAllowInvalid(false).build();
  verdictRange.setDataValidation(rule);

  // Color the Verdict cells by value
  var cfRules = [];
  VERDICTS.forEach(function(v) {
    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(v).setBackground(VERDICT_COLORS[v])
      .setRanges([verdictRange]).build());
  });
  sh.setConditionalFormatRules(cfRules);

  // Layout
  sh.setFrozenRows(2);
  sh.setColumnWidth(1, 34);    // #
  sh.setColumnWidth(2, 110);   // Principle
  sh.setColumnWidth(3, 250);   // Issue
  sh.setColumnWidth(4, 95);    // WCAG
  sh.setColumnWidth(5, 230);   // Where
  sh.setColumnWidth(6, 90);    // Prediction
  sh.setColumnWidth(7, 170);   // Baseline
  sh.setColumnWidth(8, 170);   // Overlay
  sh.setColumnWidth(9, 100);   // Verdict
  sh.setColumnWidth(10, 320);  // Notes
  sh.getRange(2, 1, lastDataRow - 1, nCols)
    .setBorder(true, true, true, true, true, true, '#bfbfbf', SpreadsheetApp.BorderStyle.SOLID);

  // Summary tally (COUNTIF over the Verdict column)
  var sumRow = lastDataRow + 2;
  sh.getRange(sumRow, 2).setValue('Summary').setFontWeight('bold');
  var vCol = 'I'; // Verdict column letter
  var vRange = vCol + firstDataRow + ':' + vCol + lastDataRow;
  var labels = VERDICTS.concat(['TOTAL']);
  for (var i = 0; i < labels.length; i++) {
    var rrow = sumRow + 1 + i;
    sh.getRange(rrow, 2).setValue(labels[i]);
    if (labels[i] === 'TOTAL') {
      sh.getRange(rrow, 3).setFormula('=COUNTA(' + vRange + ')').setFontWeight('bold');
    } else {
      sh.getRange(rrow, 3).setFormula('=COUNTIF(' + vRange + ',"' + labels[i] + '")');
      sh.getRange(rrow, 2).setBackground(VERDICT_COLORS[labels[i]]);
    }
  }

  // Legend for the prediction column
  var legRow = sumRow + 1;
  sh.getRange(legRow, 5).setValue('Prediction key:').setFontWeight('bold');
  sh.getRange(legRow + 1, 5).setValue('🟢 overlay plausibly addresses this');
  sh.getRange(legRow + 2, 5).setValue('🟡 overlay claims to — verify');
  sh.getRange(legRow + 3, 5).setValue('🔴 outside what an overlay can do');
}

function buildRegression_(ss) {
  var name = 'Regression';
  var old = ss.getSheetByName(name);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(name);

  var headers = ['Overlay footprint check', 'Result', 'Notes'];
  sh.getRange(1, 1, 1, 3).merge()
    .setValue('Does the overlay itself introduce problems?')
    .setFontSize(13).setFontWeight('bold')
    .setBackground('#1f3864').setFontColor('#ffffff');
  sh.setRowHeight(1, 30);
  sh.getRange(2, 1, 1, 3).setValues([headers])
    .setFontWeight('bold').setBackground('#d9e1f2');

  var rows = REGRESSION_CHECKS.map(function(c) { return [c, '', '']; });
  sh.getRange(3, 1, rows.length, 3).setValues(rows).setWrap(true).setVerticalAlignment('top');

  sh.setFrozenRows(2);
  sh.setColumnWidth(1, 380);
  sh.setColumnWidth(2, 120);
  sh.setColumnWidth(3, 360);
  sh.getRange(2, 1, rows.length + 1, 3)
    .setBorder(true, true, true, true, true, true, '#bfbfbf', SpreadsheetApp.BorderStyle.SOLID);
}
