<%@ page language="java"%>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="org.apache.http.HttpStatus"%>
<%@ page import="com.tbwa.nuxeo.creative.website.webengine.LibraryWebUIHelper"%>
<% boolean valid = LibraryWebUIHelper.verifyUserPermission(request);
  if (!valid) { response.sendError(HttpStatus.SC_UNAUTHORIZED); return; }
%>
<% String context = request.getContextPath(); %>
<!doctype html>
<html>
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-P923KRR');</script>
  <!-- End Google Tag Manager -->
  <meta charset="utf-8">
  <title>Know\edge</title>
  <base href="<%=context%>/LibraryWebUI/">
  <meta name="description" content="Know\edge">
  <meta name="keywords" content="Know\edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="<%=context%>/favicon.png">
  <link rel="icon" type="image/x-icon" href="<%=context%>/favicon.ico">
  <link rel="stylesheet" href="<%=context%>/LibraryWebUI/styles.59e97fa8412320e13638.css">
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P923KRR" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <%@include file="loading.ftl"%>
  <script src="<%=context%>/LibraryWebUI/runtime-es2015.44043b25bbf0d0c28404.js" type="module" crossorigin="use-credentials"></script>
  <script src="<%=context%>/LibraryWebUI/runtime-es5.44043b25bbf0d0c28404.js" nomodule defer></script>
  <script src="<%=context%>/LibraryWebUI/polyfills-es5.1bec5976535ab87a7348.js" nomodule defer></script>
  <script src="<%=context%>/LibraryWebUI/polyfills-es2015.298cc3446c36b1f559cb.js" type="module" crossorigin="use-credentials"></script>
  <script src="<%=context%>/LibraryWebUI/scripts.6a6ca6e3348a3c2e3c46.js" defer></script>
  <script src="<%=context%>/LibraryWebUI/main-es2015.53b5617e55d4daf72e3c.js" type="module" crossorigin="use-credentials"></script>
  <script src="<%=context%>/LibraryWebUI/main-es5.53b5617e55d4daf72e3c.js" nomodule defer></script>
</body>
</html>

