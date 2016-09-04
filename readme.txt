This project was rooted in 2 goals:

(1) To design a markdown processor that used regular expressions to find and replace text;

(2) To include in that processor certain constructs that are not part of standard markdown, but that I would find useful. Those constructs include:

  * Replacing "--" with "&ndash";
  * Replacing single and double quotes with their left- and right-quote equivalents;
  * Placing <abbr> tags around inline abbreviations -- which I style as ^[IA](Inline Abbreviation)
  * Continuation markers ("_" or "\") at the end of a line to make text flow without a line break;
  * Insertion of non-breaking spaces or non-breaking hyphens, respectively with "\ " or "\-".
  * Tables (as used in Pivotal Tracker markdown, but not common in other markdown implementations).

The markdown recognizes all constructs with which I am familiar for basic text layout:

(1) Unordered lists can begin with asterisks, hyphens, or plus signs.

(2) Ordered and unordered lists can continue with asterisks, hyphens, or plus signs. (Currently it espects indents to be exactly 2 spaces.)

(3) Preformatted text can begin with 4 spaces, or be framed by 3 backticks (```).

(4) Headers can be preceded by pound signs, or followed by equals signs (<h1>) or hyphens (<h2>) on the next line.

(5) Horizontal rules can be designated by at least 3 hypens, asterisks, or underlines (with or without spaces) on a line.

(6) All of the following will render a table successfully:

    (A) +--------------+--------------+--------------+
        | Table Head A | Table Head B | Table Head C |
        +--------------+--------------+--------------+
        | Item A1      | Item B1      | Item C1      |
        | Item A3      | Item B2      | Item C2      |
        +--------------+--------------+--------------+

    (B) -------------+--------------+-------------
        Table Head A | Table Head B | Table Head C
        -------------+--------------+-------------
        Item A1      | Item B1      | Item C1
        Item A3      | Item B2      | Item C2
        -------------+--------------+-------------

    (C) Table Head A | Table Head B | Table Head C
        -------------+--------------+-------------
        Item A1      | Item B1      | Item C1
        Item A3      | Item B2      | Item C2


The commands in parsetext.js are preceded by comments with a designator. Those designators correspond to the descriptions below.

======================================================================
General 1
======================================================================

(A01) Put \r\n\r\n at beginning and end to simplify logic for other functions:

(A02) Replace ampersand (&) with "&amp;":
Initial markup is:
    The less-than character is &lt;
Result of the above:
    The less-than character is &amp;lt;
(Note that in the Example.htm textbox result it is displayed by the browser as a regular ampersand.)

(A03) Replace "\-" with a non-breaking hyphen ("&#8209;"):
Initial markup is:
    non\-breaking hyphen
Result of the above:
    non&#8209;breaking hyphen

(A03) Replace "\ " with a non-breaking hyphen ("&nbsp;"):
Initial markup is:
    non-breaking\ space
Result of the above:
    non-breaking&nbsp;space

(A05) Escape characters preceded by a backslash:
Initial markup is:
    \* This is a test of an escaped asterisk.
Result of the above:
    &#42; This is a test of an escaped asterisk.
(Note that in the Example.htm textbox result it is displayed by the browser as a regular asterisk.)

(A06) Escape "<":

(A07) Escape ">":

(A08) Replace """ before a word with "&ldquo;":

(A00) Replace """ elsewhere with "&rdquo;":

(A10) Replace "'" before a word with "&lsquo;":

(A11) Replace "'" elsewhere with "&rsquo;":


======================================================================
Headings
======================================================================
Initial markup is:
    # Header 1

    ## Header 2

    ### Header 3

    #### Header 4

    ##### Header 5

    ###### Header 6

    Header 1
    ===

    Header 2
    ---

(B01) Convert lines that begin with "#" to the appropriate heading level
Result of the above:
    <h1>Header 1</h1>

    <h2>Header 2</h2>

    <h3>Header 3</h3>

    <h4>Header 4</h4>

    <h5>Header 5</h5>

    <h6>Header 6</h6>

    Header 1
    ===

    Header 2
    ---

(B02) Convert lines followed by === to <h1>
Result of the above:
    <h1>Header 1</h1>

    <h2>Header 2</h2>

    <h3>Header 3</h3>

    <h4>Header 4</h4>

    <h5>Header 5</h5>

    <h6>Header 6</h6>

    <h1>Header 1</h1>

    Header 2
    ---

(B03) Convert lines followed by --- to <h2>
Result of the above:
    <h1>Header 1</h1>

    <h2>Header 2</h2>

    <h3>Header 3</h3>

    <h4>Header 4</h4>

    <h5>Header 5</h5>

    <h6>Header 6</h6>

    <h1>Header 1</h1>

    <h2>Header 2</h2>


======================================================================
Horizontal Rule
======================================================================

(C01) Replace 3 asterisks, hyphens, or underscores on a line (with or without spaces) with <hr>:
Initial markup is:
    -  -  -

    * * *

    ___
Result of the above:
    <hr />

    <hr />

    <hr />


======================================================================
Line Breaks
======================================================================
Initial markup is:
    This is a test of   
    a line break.
    and a line with a continuation marker so it does not _
    get broken into multiple lines
    a forced mid-line line break ## using the double-#

(D01) Convert double spaces at the end of a line to a line break:
Result of the above:
    This is a test of<br />a line break.
    and a line with a continuation marker so it does not _
    get broken into multiple lines
    a forced mid-line line break ## using the double-#

(D02) Remove linefeed after line continuation character:
Result of the above:
    This is a test of<br />a line break.
    and a line with a continuation marker so it does not get broken into multiple lines
    a forced mid-line line break ## using the double-#

(D03) Convert mid-line "##" to <br />
Result of the above:
    This is a test of<br />a line break.
    and a line with a continuation marker so it does not get broken into multiple lines
    a forced mid-line line break<br />using the double-#


======================================================================
Lists
======================================================================
Initial markup is:
    * Test A
    * Test B
    * Test C
      1. Test C1
      1. Test C2
      1. Test C3
        * Test C3a
          1. Test C3a(i)
          1. Test C3a(ii)
        * Test C3b
    * Test D

(E01) Put all lines preceded by asterisks, hyphens, plus signs, or digits inside <li> tags:
Result of the above:
    <li>* Test A</li>
    <li>* Test B</li>
    <li>* Test C</li>
    <li>  1. Test C1</li>
    <li>  1. Test C2</li>
    <li>  1. Test C3</li>
    <li>    * Test C3a</li>
    <li>      1. Test C3a(i)</li>
    <li>      1. Test C3a(ii)</li>
    <li>    * Test C3b</li>
    <li>* Test D</li>

(E02) Cluster all bulleted items with the same indent level on the same line:
Result of the above:
    <li>* Test A</li><li>* Test B</li><li>* Test C</li>
    <li>  1. Test C1</li><li>  1. Test C2</li><li>  1. Test C3</li>
    <li>    * Test C3a</li>
    <li>      1. Test C3a(i)</li><li>      1. Test C3a(ii)</li>
    <li>    * Test C3b</li>
    <li>* Test D</li>

(E03) For unordered lists, remove the list marker for the first <li>, and put the indentation (if any) before the <li>:
Result of the above:
    <ul><li>Test A</li><li>* Test B</li><li>* Test C</li>
    <li>  1. Test C1</li><li>  1. Test C2</li><li>  1. Test C3</li>
        <ul><li>Test C3a</li>
    <li>      1. Test C3a(i)</li><li>      1. Test C3a(ii)</li>
        <ul><li>Test C3b</li>
    <ul><li>Test D</li>

(E04) For ordered lists, remove the number for the first <li>, and put the indentation (if any) before the <li>:
Result of the above:
    <ul><li>Test A</li><li>* Test B</li><li>* Test C</li>
      <ol><li>Test C1</li><li>  1. Test C2</li><li>  1. Test C3</li>
        <ul><li>Test C3a</li>
          <ol><li>Test C3a(i)</li><li>      1. Test C3a(ii)</li>
        <ul><li>Test C3b</li>
    <ul><li>Test D</li>

(E05) Remove the remaining list markers and/or numbers:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C</li>
      <ol><li>Test C1</li><li>Test C2</li><li>Test C3</li>
        <ul><li>Test C3a</li>
          <ol><li>Test C3a(i)</li><li>Test C3a(ii)</li>
        <ul><li>Test C3b</li>
    <ul><li>Test D</li>

(E06) Put one <ul> tag for each set of 2 spaces at the beginning of unordered list lines:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C</li>
      <ol><li>Test C1</li><li>Test C2</li><li>Test C3</li>
    <ul><ul><ul><li>Test C3a</li>
          <ol><li>Test C3a(i)</li><li>Test C3a(ii)</li>
    <ul><ul><ul><li>Test C3b</li>
    <ul><li>Test D</li>

(E07) Put one <ol> tag for each set of 2 spaces at the beginning of ordered list lines:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C</li>
    <ol><ol><li>Test C1</li><li>Test C2</li><li>Test C3</li>
    <ul><ul><ul><li>Test C3a</li>
    <ol><ol><ol><ol><li>Test C3a(i)</li><li>Test C3a(ii)</li>
    <ul><ul><ul><li>Test C3b</li>
    <ul><li>Test D</li>

(E08) Duplicate the <ul> and/or <ol> tags one-for-one at the end of the line:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C</li><ul>
    <ol><ol><li>Test C1</li><li>Test C2</li><li>Test C3</li><ol><ol>
    <ul><ul><ul><li>Test C3a</li><ul><ul><ul>
    <ol><ol><ol><ol><li>Test C3a(i)</li><li>Test C3a(ii)</li><ol><ol><ol><ol>
    <ul><ul><ul><li>Test C3b</li><ul><ul><ul>
    <ul><li>Test D</li><ul>

(E09) Put <close> tags one-for-one at the end of the line for <ul> and <ol> tags at the beginning of the line:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C</li><close>
    <ol><ol><li>Test C1</li><li>Test C2</li><li>Test C3</li><close><close>
    <ul><ul><ul><li>Test C3a</li><close><close><close>
    <ol><ol><ol><ol><li>Test C3a(i)</li><li>Test C3a(ii)</li><close><close><close><close>
    <ul><ul><ul><li>Test C3b</li><close><close><close>
    <ul><li>Test D</li><close>

(E10) Remove <close><ul> and <close><ol> tags when they frame a line break:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C</li>
    <ol><li>Test C1</li><li>Test C2</li><li>Test C3</li>
    <ul><li>Test C3a</li>
    <ol><li>Test C3a(i)</li><li>Test C3a(ii)</li><close>
    <li>Test C3b</li><close><close>
    <li>Test D</li><close>

(E11) When </li> and <ul> or <ol> frame a line break, move </li> to the end of the <ul>/<ol> line:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C
    <ol><li>Test C1</li><li>Test C2</li><li>Test C3
    <ul><li>Test C3a
    <ol><li>Test C3a(i)</li><li>Test C3a(ii)</li><close></li></li></li>
    <li>Test C3b</li><close><close>
    <li>Test D</li><close>

(E12) When multiple </li> tags are at the end of a line, move them to between the <close> tags on the next line
(This is not perfect, but it also is not critical as HTML4 and HTML5 do not require <li> tags to be closed):
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C
    <ol><li>Test C1</li><li>Test C2</li><li>Test C3
    <ul><li>Test C3a
    <ol><li>Test C3a(i)</li><li>Test C3a(ii)</li><close></li>
    <li>Test C3b</li><close></li><close></li>
    <li>Test D</li><close>

(E13) Get the entire list on one line:
For <ul>...<close> and <ol>...<close>, change to <ul-open>...</ul> or <ol-open>...</ol>:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C<ol><li>Test C1</li><li>Test C2</li><li>Test C3<ul><li>Test C3a<ol><li>Test C3a(i)</li><li>Test C3a(ii)</li><close></li><li>Test C3b</li><close></li><close></li><li>Test D</li><close>

(E14) Convert <close> to </ul> or </ol> as appropriate; temporarily add "-open" to <ul> and <ol> tags:
Result of the above:
    <ul-open><li>Test A</li><li>Test B</li><li>Test C<ol-open><li>Test C1</li><li>Test C2</li><li>Test C3<ul-open><li>Test C3a<ol-open><li>Test C3a(i)</li><li>Test C3a(ii)</li></ol></li><li>Test C3b</li></ul></li></ol></li><li>Test D</li></ul>

(E15) Remove "-open" from <ul-open> and <ol-open>:
Result of the above:
    <ul><li>Test A</li><li>Test B</li><li>Test C<ol><li>Test C1</li><li>Test C2</li><li>Test C3<ul><li>Test C3a<ol><li>Test C3a(i)</li><li>Test C3a(ii)</li></ol></li><li>Test C3b</li></ul></li></ol></li><li>Test D</li></ul>


======================================================================
Preformatted 1
======================================================================
Initial markup is:
    ```
    several
     lines
      of
       preformatted
        code
    ```

        several
         lines
          of
           preformatted
            code

(F01) Replace ``` with opening and closing <pre> tags:
Result of the above:
    <pre>several
     lines
      of
       preformatted
        code
    </pre>

        several
         lines
          of
           preformatted
            code

(F02) Frame every line inside the <pre> tags with <pre> tags:
Result of the above:
    <pre>several
    </pre>
    <pre> lines
    </pre>
    <pre>  of
    </pre>
    <pre>   preformatted
    </pre>
    <pre>    code
    </pre>

        several
         lines
          of
           preformatted
            code

(F03) Frame lines that begin with 4 spaces to have <pre> tags (remove exactly 4 spaces):
Result of the above:
    <pre>several
    </pre>
    <pre> lines
    </pre>
    <pre>  of
    </pre>
    <pre>   preformatted
    </pre>
    <pre>    code
    </pre>

    <pre>several
    </pre>
    <pre> lines
    </pre>
    <pre>  of
    </pre>
    <pre>   preformatted
    </pre>
    <pre>    code
    </pre>


======================================================================
Blockquote
======================================================================
Initial markup is:
    > Blockquote
    > paragraph
         
    > with 
    > multiple (sometimes interrupted)

    > lines

(G01) Frame lines that begin with ">" (and intervening blank lines) with <blockquote>:
Result of the above:
    <blockquote>

    > Blockquote
    > paragraph
         
    > with 
    > multiple (sometimes interrupted)

    > lines

    </blockquote>

(G02) Remove ">" at the beginning of blockquote lines:
Result of the above:
    <blockquote>

    Blockquote
    paragraph
         
    with 
    multiple (sometimes interrupted)

    lines

    </blockquote>


======================================================================
Tables
======================================================================
(Note that tags are written first with underscores to avoid a display error.)
Initial markup is:
    --------------+--------------+--------------
    Table Head A | Table Head B | Table Head C 
    --------------+--------------+--------------
    Item A1      | Item B1      | Item C1      
    Item A3      | Item B2      | Item C2      
    --------------+--------------+--------------

(H01) Insert left "|" if it is missing in a table setup:
(H02) Insert right "|" if it is missing in a table setup:
Result of the above:
    --------------+--------------+--------------
    | Table Head A | Table Head B | Table Head C |
    --------------+--------------+--------------
    | Item A1      | Item B1      | Item C1      |
    | Item A3      | Item B2      | Item C2      |
    --------------+--------------+--------------
... which mimicks a standard table display of:
    +--------------+--------------+--------------+
    | Table Head A | Table Head B | Table Head C |
    +--------------+--------------+--------------+
    | Item A1      | Item B1      | Item C1      |
    | Item A3      | Item B2      | Item C2      |
    +--------------+--------------+--------------+

(H03) Correct missapplication of <h2> style if <thead>-<tbody> separator only uses hyphens:
Initial markup is:
    |<h2>Table Head A | Table Head B | Table Head C</h2>
    |Item A1      | Item B1      | Item C1
    |Item A3      | Item B2      | Item C2
Result of the above:
    |Table Head A | Table Head B | Table Head C
    ---
    |Item A1      | Item B1      | Item C1
    |Item A3      | Item B2      | Item C2
    
(H04) Replace divider lines with </thead><tbody> separator
Result of the above:
    +--------------+--------------+--------------+
    | Table Head A | Table Head B | Table Head C |
    </thead_><tbody_>
    | Item A1      | Item B1      | Item C1      |
    | Item A3      | Item B2      | Item C2      |
    +--------------+--------------+--------------+

(H05) Remove remaining divider lines:
Result of the above:
    | Table Head A | Table Head B | Table Head C |
    </thead_><tbody_>
    | Item A1      | Item B1      | Item C1      |
    | Item A3      | Item B2      | Item C2      |

(H06) Define <tr> lines:
Result of the above:
    <tr_><td_>Table Head A | Table Head B | Table Head C</td_></tr_>
    </thead_><tbody_>
    <tr_><td_>Item A1      | Item B1      | Item C1</td_></tr_>
    <tr_><td_>Item A3      | Item B2      | Item C2</td_></tr_>

(H07) Place remaining <td> tags:
Result of the above:
    <tr_><td_>Table Head A</td_><td_>Table Head B</td_><td_>Table Head C</td_></tr_>
    </thead_><tbody_>
    <tr_><td_>Item A1</td_><td_>Item B1</td_><td_>Item C1</td_></tr_>
    <tr_><td_>Item A3</td_><td_>Item B2</td_><td_>Item C2</td_></tr_>

(H08) Unite on one line (all lines end with either </tr_> or <tbody>; all begin with either <tr_> or </thead_>):
Result of the above:
    <tr_><td_>Table Head A</td_><td_>Table Head B</td_><td_>Table Head C</td_></tr_></thead_><tbody_><tr_><td_>Item A1</td_><td_>Item B1</td_><td_>Item C1</td_></tr_><tr_><td_>Item A3</td_><td_>Item B2</td_><td_>Item C2</td_></tr_>

(H08) If there were multiple header-body separators, remove the extras:

(H10) Frame the content with <table> tags:
Result of the above:
    <table_><tr_><td_>Table Head A</td_><td_>Table Head B</td_><td_>Table Head C</td_></tr_></thead_><tbody_><tr_><td_>Item A1</td_><td_>Item B1</td_><td_>Item C1</td_></tr_><tr_><td_>Item A3</td_><td_>Item B2</td_><td_>Item C2</td_></tr_></table_>

(H11) Add the <thead_> tag, if needed:
Result of the above:
    <table_><thead_><tr_><td_>Table Head A</td_><td_>Table Head B</td_><td_>Table Head C</td_></tr_></thead_><tbody_><tr_><td_>Item A1</td_><td_>Item B1</td_><td_>Item C1</td_></tr_><tr_><td_>Item A3</td_><td_>Item B2</td_><td_>Item C2</td_></tr_></table_>

(H12) Add the </tbody_> tag, if needed:
Result of the above:
    <table_><thead_><tr_><td_>Table Head A</td_><td_>Table Head B</td_><td_>Table Head C</td_></tr_></thead_><tbody_><tr_><td_>Item A1</td_><td_>Item B1</td_><td_>Item C1</td_></tr_><tr_><td_>Item A3</td_><td_>Item B2</td_><td_>Item C2</td_></tr_></tbody_></table_>

(H13) Convert <td> to <th> inside <thead> tags:
Result of the above:
    <table_><thead_><tr_><th_>Table Head A</th_><th_>Table Head B</th_><th_>Table Head C</th_></tr_></thead_><tbody_><tr_><td_>Item A1</td_><td_>Item B1</td_><td_>Item C1</td_></tr_><tr_><td_>Item A3</td_><td_>Item B2</td_><td_>Item C2</td_></tr_></tbody_></table_>

(H14) Remove the temporary underscores:
Result of the above:
    <table><thead><tr><th>Table Head A</th><th>Table Head B</th><th>Table Head C</th></tr></thead><tbody><tr><td>Item A1</td><td>Item B1</td><td>Item C1</td></tr><tr><td>Item A3</td><td>Item B2</td><td>Item C2</td></tr></tbody></table>


======================================================================
General 2
======================================================================

(I01) Remove whitespace in lines with no non-whitespace characters:

(I02) Remove whitespace from beginnings of lines:

(I03) Remove whitespace from ends of lines:

(I04) Remove extra linefeeds when there are more than 2 between lines with content:

(I05) Put <p> between remaining items without block tags:

(I06) Put <p> before remaining items without block tags:

(I07) Put <p> after remaining items without block tags:

(I08) Replace remaining line feeds in text with <br />:

(I09) Format italics (framed by "_"):

(I10) Format bold (framed by "**"):

(I11) Format strikethrough (framed by "~~"):

(I12) Format code (framed by "`"):

(I13) Replace "--" with "&ndash;":

(I14) Render abbreviations:

(I15) Render images:

(I16) Render hyperlinks and e-mails from markdown:

(I17) Render hyperlinks in text:

(I18) Render e-mails in text:


======================================================================
Preformatted 2
======================================================================
Initial markup is:
    <pre>several
    </pre>
    <pre>lines
    </pre>
    <pre>of
    </pre>
    <pre>preformatted
    </pre>
    <pre>code
    </pre>

(J01) Replace duplicated <pre> tags:
Result of the above:
    <pre>several
     lines
      of
       preformatted
        code
    </pre>

    <pre>several
     lines
      of
       preformatted
        code
    </pre>
