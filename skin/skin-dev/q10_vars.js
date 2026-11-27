(() => { const st = document.documentElement.style; const o = {}; for (let i = 0; i < st.length; i++) { const k = st[i]; o[k] = st.getPropertyValue(k).trim(); } return o; })()
