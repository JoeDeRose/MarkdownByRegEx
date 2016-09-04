function ParseMarkdown( Content ) {

    // See readme.txt for a plain text description of the logic for the respective identifiers.
	
    // ----------------------------------------------------------------------
    // General 1
    // ----------------------------------------------------------------------
    // (A01)
	Content = "\r\n\r\n" + Content + "\r\n\r\n";
    // (A02)
	Content = Content.replace(
		/\\(.)/g,
		function( match, p1 ) {
			return "&#" + p1.charCodeAt( 0 ) + ";";
		}
	);
    // (A03)
	Content = Content.replace( /</g, "&lt;" );
    // (A04)
	Content = Content.replace( /(.)>/gm, "$1&gt;" );
    // (A05)
	Content = Content.replace( /(^|\s)"/g, "$1&ldquo;" );
    // (A06)
	Content = Content.replace( /"/g, "&rdquo;" );
    // (A07)
	Content = Content.replace( /(^|\s)'/g, "$1&lsquo;" );
    // (A08)
	Content = Content.replace( /'/g, "&rsquo;" );

    // ----------------------------------------------------------------------
    // Headings
    // ----------------------------------------------------------------------
    // (B01)
	Content = Content.replace(
		/^(#+) (.*?)$/gm,
		function( match, p1, p2 ) {
			return "<h" + p1.length + ">" + p2 + "</h" + p1.length + ">";
		}
	);
    // (B02)
	Content = Content.replace( /^(.*?)\r?\n=+$/gm, "<h1>$1</h1>" );
    // (B03)
	Content = Content.replace( /^(.*?)\r?\n\-+$/gm, "<h2>$1</h2>" );

    // ----------------------------------------------------------------------
    // Horizontal Rule
    // ----------------------------------------------------------------------
    // (C01)
	ThisRegExp = new RegExp( /^([\-\*_] *){3,}$/, "gm" );
	while ( ThisRegExp.test( Content ) ) {
		Content = Content.replace( ThisRegExp, "\r\n<hr />\r\n" );
	}

    // ----------------------------------------------------------------------
    // Line Breaks
    // ----------------------------------------------------------------------
    // (D01)
	Content = Content.replace( /(\S)  \r?\n */gm, "$1<br />" );
    // (D02)
	Content = Content.replace( / +[_\\]\r?\n */g, " " );
    // (D0#)
	Content = Content.replace( / +## +/g, "<br />" );

    // ----------------------------------------------------------------------
    // Lists
    // ----------------------------------------------------------------------
    // (E01)
	Content = Content.replace( /^( *(\*|\-|\+|\d+\.) +.*?)$/gm, "<li>$1</li>" );
    // (E02)
	Content = Content.replace( /^(<li> *)((\*|\-|\+|\d+\.) +)(.*?)\r?\n(?=\1(\*|\-|\+|\d+\.))/gm, "$1$2$4" );
    // (E03)
	Content = Content.replace( /^<li>( *)(\*|\-|\+) +/gm, "$1<ul><li>" );
    // (E04)
	Content = Content.replace( /^<li>( *)\d+\. +/gm, "$1<ol><li>" );
    // (E05)
	Content = Content.replace( /<li> *(\*|\-|\+|\d+\.) +/g, "<li>" );
    // (E06)
	Content = Content.replace( / {2}(?= *<ul>)/gm, "<ul>" );
    // (E07)
	Content = Content.replace( / {2}(?= *<ol>)/gm, "<ol>" );
    // (E08)
	Content = Content.replace( /((<ul>|<ol>)+)(.+)$/gm, "$1$3$1" );
    // (E09)
	Content = Content.replace( /(<ul>|<ol>)(?=(<ul>|<ol>)*$)/gm, "<close>" );
    // (E10)
	ThisRegExp = new RegExp( /<close>(\r?\n)(<ul>|<ol>)/, "g" );
	while ( ThisRegExp.test( Content ) ) {
		Content = Content.replace( ThisRegExp, "$1" );
	}
    // (E11)
	ThisRegExp = new RegExp( /<\/li>(\r?\n(<ul>|<ol>).+)$/, "gm" );
	while ( ThisRegExp.test( Content ) ) {
		Content = Content.replace( ThisRegExp, "$1</li>" );
	}
    // (E12)
	ThisRegExp = new RegExp( /<\/li><\/li>(\r?\n.+?<\/li><close>)(?=((<close>)+|$))/, "gm" );
	while ( ThisRegExp.test( Content ) ) {
		Content = Content.replace( ThisRegExp, "</li>$1</li>" );
	}
    // (E13)
	Content = Content.replace( /((<ul>|<ol>|<li>).+)\r?\n(?=(<ul>|<ol>|<li>))/g, "$1" );
    // (E14)
	ThisRegExp = new RegExp( /<(ul|ol)>(.+)<close>/, "g" );
	while ( ThisRegExp.test( Content ) ) {
		Content = Content.replace( ThisRegExp, "<$1-open>$2</$1>" );
	}
    // (E15)
	Content = Content.replace( /<(ul|ol)\-open>/g, "<$1>" );

    // ----------------------------------------------------------------------
    // Preformatted 1
    // ----------------------------------------------------------------------
    // (F01)
    Content = Content.replace( /```(\r?\n)?((\r|\n|.)+?)(\r?\n)?```/g, "<pre>$2$4</pre>" );
    // (F02)
	ThisRegExp = new RegExp( /(<pre>.*?)(\r?\n)(?!<\/pre>)/, "g" );
	while ( ThisRegExp.test( Content ) ) {
		Content = Content.replace( ThisRegExp, "$1$2</pre>$2<pre>" );
	}
    // (F03)
    Content = Content.replace( /^ {4}(.*?)(\r?\n|$)/gm, "<pre>$1$2</pre>$2" );

    // ----------------------------------------------------------------------
    // Blockquote
    // ----------------------------------------------------------------------
    // (G01)
    Content = Content.replace( /^(> +.*(\r?\n|$)(> +.*(\r?\n|$)|\s*(\r?\n|$))*\s*(\r?\n|$))/gm, "<blockquote>\r\n\r\n$1</blockquote>\r\n\r\n" );
    // (G02)
    Content = Content.replace( /^> +/gm, "" );

    // ----------------------------------------------------------------------
    // Tables
    // ----------------------------------------------------------------------
    // (H01)
	Content = Content.replace( /^([^\|\r\n].+?\|)/gm, "|$1" );
    // (H02)
    Content = Content.replace( /^(\|)<h2>(.*?)<\/h2>/gm, "$1$2\r\n---" );
	// (H03)
	Content = Content.replace( /(\|.+?[^\|])$/gm, "$1|" );
    // (H04)
	Content = Content.replace( /(\|\r?\n)[\+\-\|]+(\r?\n\|)/g, "$1</thead_><tbody_>$2" );
    // (H05)
	Content = Content.replace( /^[\+\-\|]+$/gm, "" );
    // (H06)
	Content = Content.replace( /\| *(.*?) *\|\r?\n/g, "<tr_><td_>$1</td_></tr_>\r\n" );
    // (H07)
	ThisRegExp = new RegExp( /(<td_>.*?) *\| */, "g" );
	while ( ThisRegExp.test( Content ) ) {
		Content = Content.replace( ThisRegExp, "$1</td_><td_>" );
	}
    // (H08)
	Content = Content.replace( /(<\/tr_>|<tbody_>)\r?\n(<tr_>|<\/thead_>)/g, "$1$2" );
    // (H09)
	Content = Content.replace( /(<tbody_>.*)<\/thead_><tbody_>/g, "$1" );
	// (H10)
	Content = Content.replace( /^(<tr_>.*?<\/tr_>)$/gm, "<table_>$1</table_>" );
    // (H11)
	Content = Content.replace( /(<table_>)(.*?<\/thead_>)/g, "$1<thead_>$2" );
    // (H12)
	Content = Content.replace( /(<tbody_>.*?)(<\/table_>)/g, "$1</tbody_>$2" );
    // (H13)
	ThisRegExp = new RegExp( /(<thead_>.*?<\/?)td(_>)(?=.*<\/thead_>)/, "g" );
	while ( ThisRegExp.test( Content ) ) {
		Content = Content.replace( ThisRegExp, "$1th$2" );
	}
    // (H14)
	Content = Content.replace( /(<\/?(table|thead|tbody|tr|th|td))_(>)/g, "$1$3" );
    
    
    // ----------------------------------------------------------------------
    // General 2
    // ----------------------------------------------------------------------
    // (I01)
	Content = Content.replace( /^[ \t]+$/gm, "" );
    // (I02)
	Content = Content.replace( /^[ \t]+/gm, "" );
    // (I03)
	Content = Content.replace( /[ \t]+$/gm, "" );
    // (I04)
	Content = Content.replace( /(\r?\n){3,}/g, "$1$1" );
    // (I05)
	Content = Content.replace( /([^>\r\n])(\r?\n\r?\n)([^<])/g, "$1</p>$2<p>$3" );
    // (I06)
	Content = Content.replace( /(\r?\n\r?\n)([^<])/g, "$1<p>$2" );
    // (I07)
	Content = Content.replace( /([^>\r\n])(\r?\n\r?\n)/g, "$1</p>$2" );
    // (I08)
	Content = Content.replace( /([^>\r\n])\r?\n([^<])/g, "$1<br />$2" );
    // (I09)
	Content = Content.replace( /_(.*?)_/g, "<em>$1</em>" );
    // (I10)
	Content = Content.replace( /\*\*(.*?)\*\*/g, "<strong>$1</strong>" );
    // (I11)
	Content = Content.replace( /~~(.*?)~~/g, "<strike>$1</strike>" );
    // (I12)
	Content = Content.replace( /`(.*?)`/g, "<code>$1</code>" );
    // (I13)
	Content = Content.replace( /\-\-/g, "&ndash;" );
    // (I14)
	Content = Content.replace( /\^\[(.*?)\]\((.*?)\)/g, "<abbr title=\"$2\" >$1</abbr>" );
    // (I15)
	Content = Content.replace(
		/!\[(.*?)\]\((.*?)\)/g,
		function( match, p1, p2 ) {
            var imagelocation = p2;
            if ( /^https?:\/\//.test( imagelocation ) == false ) {
                imagelocation = "http://" + imagelocation;
            }
			return "<img src=\"" + imagelocation + "\" title=\"" + p1 + "\" alt=\"" + p1 + "\" />";
		}
	);
    // (I16)
	Content = Content.replace(
		/\[(.*?)\]\((.*?)\)/g,
		function( match, p1, p2 ) {
            var hyperlink = p2;
            if ( /^(https?:\/\/|mailto:)/.test( hyperlink ) == false ) {
                hyperlink = "http://" + hyperlink;
            }
			return "<a href=\"" + hyperlink + "\" >" + p1 + "</a>";
		}
	);
    // (I17)
	Content = Content.replace( /(^|\s)(https?:\/\/.*?)(?=[\.,\?!:;\(\)\[\]\|_\-]*(\s|<|$))/gm, "$1<a href=\"$2\" >$2</a>" );
    // (I18)
	Content = Content.replace( /(^|\s)([^ ]*?@.*?)(?=[\.,\?!:;\(\)\[\]\|_\-]*(\s|<|$))/gm, "$1<a href=\"mailto:$2\" >$2</a>" );
        
    // ----------------------------------------------------------------------
    // Preformatted 2
    // ----------------------------------------------------------------------
    // (J01)
    Content = Content.replace( /<\/pre>\r?\n<pre>/g, "" );

    return Content;
}

