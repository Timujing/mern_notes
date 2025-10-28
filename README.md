TODO:
1. add jwt auth, update rate limiting due to user id
    1. added jwt auth: authRouter and controllers, authMiddleware now work on all `/api/notes` endpoint. Added User model.
    2. add frontend logic to auth - in progress.
2. add limit to requests query?
3. migrate frontend to typescript - check
4. refactor frontend with typescript - check.
    1. added `truncate` to `<h3>` title and `text-ellipsis` to `<p>` of content
    2. types refactor.
    3. added useRef with textarea to automatically expand height to `scrollHeight` of textarea.
5. refactor backend with typescript?