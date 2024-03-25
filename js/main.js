var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = {curr: null, prev: null};
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.6'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = {curr: null, prev: null};
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover  = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout   = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove  = e => {(this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = {x: e.clientX - 8, y: e.clientY - 8}; this.cursor.classList.remove("hidden");};
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown  = e => this.cursor.classList.add("active");
        document.onmouseup    = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();
// 圆形跟随鼠标交互


// 图片放大
document.addEventListener('DOMContentLoaded', function() {
  const imageContainers = document.querySelectorAll('.galleryimg-s, .galleryimg-x, .galleryimg-y');
  
  for (let i = 0; i < imageContainers.length; i++) {
    imageContainers[i].addEventListener('click', function() {
      const img = imageContainers[i].querySelector('img');
      const existingOverlay = document.querySelector('.overlay');
      
      if (existingOverlay) {
        existingOverlay.remove();
        return;
      }
      
      showOverlay(img.src);
    });
  }

  function showOverlay(imgSrc) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const overlayImg = document.createElement('img');
    overlayImg.src = imgSrc;
    overlay.appendChild(overlayImg);

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    overlay.appendChild(closeBtn);

    overlay.style.display = 'block';

    closeBtn.addEventListener('click', function() {
      overlay.remove();
    });

    overlay.addEventListener('click', function() {
      overlay.remove();
    });
  }
});
// 图片放大

// 使用 JavaScript 以实现只有被悬停的元素保持黑色
const items = document.querySelectorAll('.post-list-item .title');

items.forEach(item => {
  item.addEventListener('mouseover', () => {
    // 当鼠标悬停在元素上时，将所有元素的颜色设置为淡灰色
    items.forEach(otherItem => {
      otherItem.style.color = 'rgb(0 0 0 / 35%)';
    });

    // 保持被悬停的元素为黑色
    item.style.color = '#333333';
  });

  item.addEventListener('mouseout', () => {
    // 当鼠标移出元素时，将所有元素的颜色重新设置为黑色
    items.forEach(otherItem => {
      otherItem.style.color = '#333333';
    });
  });
});


// 项目内容画廊偏移动画
document.addEventListener('DOMContentLoaded', function () {
    // 检查是否为手机端
    var isMobile = window.innerWidth <= 768; // 你可以根据实际需要调整阈值

    if (!isMobile) {
        // 如果不是手机端，执行以下代码

        // 获取所有的元素
        var galleryImgSElements = document.querySelectorAll('.galleryimg-s');
        var galleryImgYElements = document.querySelectorAll('.galleryimg-y');
        var galleryImgXElements = document.querySelectorAll('.galleryimg-x');

        // 存储初始位置和滚动偏移的数据
        var galleryImgSData = getInitialOffsets(galleryImgSElements);
        var galleryImgYData = getInitialOffsets(galleryImgYElements);
        var galleryImgXData = getInitialOffsets(galleryImgXElements);

        // 根据滚动距离动态调整偏移位置
        function updateOffsets(elementData, offsetMultiplier) {
            for (var i = 0; i < elementData.length; i++) {
                var isVisible = isElementVisible(elementData[i].element);
                if (isVisible) {
                    var scrolled = window.scrollY - elementData[i].initialOffset;
                    var offset = scrolled * offsetMultiplier; // 可以根据需要调整偏移速度
                    elementData[i].element.style.transform = 'translateY(' + -offset + 'px)';
                }
            }
        }

        // 更新元素位置并检查是否在可视区域内
        function updateOffsetsAndCheck(elementData, offsetMultiplier) {
            updateOffsets(elementData, offsetMultiplier);
        }

        // 获取初始位置的函数
        function getInitialOffsets(elements) {
            var data = [];
            for (var i = 0; i < elements.length; i++) {
                var initialOffset = elements[i].getBoundingClientRect().top + window.scrollY;
                data.push({
                    element: elements[i],
                    initialOffset: initialOffset
                });
            }
            return data;
        }

        // 检查元素是否在可视区域内
        function isElementVisible(element) {
            var rect = element.getBoundingClientRect();
            return (
                rect.top <= window.innerHeight &&
                rect.bottom >= 0 &&
                rect.left <= window.innerWidth &&
                rect.right >= 0
            );
        }

        // 添加滚动事件监听器
        var offsetMultiplier = 0.1; // 可以根据需要调整偏移速度
        window.addEventListener('scroll', function () {
            updateOffsetsAndCheck(galleryImgSData, offsetMultiplier);
            updateOffsetsAndCheck(galleryImgYData, offsetMultiplier);
            updateOffsetsAndCheck(galleryImgXData, -offsetMultiplier); // 负值表示向下偏移
        });
    }
});



(() => {
    var navEl = document.getElementById('theme-nav');
    navEl.addEventListener('click', (e) => {
        if (window.innerWidth <= 600) {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
            } else {
                navEl.style.height = 148 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px'
            }
            navEl.classList.toggle('open')
        } else {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
                navEl.classList.remove('open')
            }
        }
    })
    window.addEventListener('resize', (e) => {
        if (navEl.classList.contains('open')) {
            navEl.style.height = 48 + document.querySelector('#theme-nav .nav-items').clientHeight + 'px'
        }
        if (window.innerWidth > 600) {
            if (navEl.classList.contains('open')) {
                navEl.style.height = ''
                navEl.classList.remove('open')
            }
        }
    })

    // a simple solution for managing cookies
    const Cookies = new class {
        get(key, fallback) {
            const temp = document.cookie.split('; ').find(row => row.startsWith(key + '='))
            if (temp) {
                return temp.split('=')[1];
            } else {
                return fallback
            }
        }
        set(key, value) {
            document.cookie = key + '=' + value + '; path=' + document.body.getAttribute('data-config-root')
        }
    }

    const ColorScheme = new class {
        constructor() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { this.updateCurrent(Cookies.get('color-scheme', 'auto')) })
        }
        get() {
            const stored = Cookies.get('color-scheme', 'auto')
            this.updateCurrent(stored)
            return stored
        }
        set(value) {
            bodyEl.setAttribute('data-color-scheme', value)
            Cookies.set('color-scheme', value)
            this.updateCurrent(value)
            return value
        }
        updateCurrent(value) {
            var current = 'light'
            if (value == 'auto') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    current = 'dark'
                }
            } else {
                current = value
            }
            document.body.setAttribute('data-current-color-scheme', current)
        }
    }

    if (document.getElementById('theme-color-scheme-toggle')) {
        var bodyEl = document.body
        var themeColorSchemeToggleEl = document.getElementById('theme-color-scheme-toggle')
        var options = themeColorSchemeToggleEl.getElementsByTagName('input')

        if (ColorScheme.get()) {
            bodyEl.setAttribute('data-color-scheme', ColorScheme.get())
        }

        for (const option of options) {
            if (option.value == bodyEl.getAttribute('data-color-scheme')) {
                option.checked = true
            }
            option.addEventListener('change', (ev) => {
                var value = ev.target.value
                ColorScheme.set(value)
                for (const o of options) {
                    if (o.value != value) {
                        o.checked = false
                    }
                }
            })
        }
    }

    if (document.body.attributes['data-rainbow-banner']) {
        var shown = false
        switch (document.body.attributes['data-rainbow-banner-shown'].value) {
            case 'always':
                shown = true
                break;
            case 'auto':
                shown = new Date().getMonth() + 1 == parseInt(document.body.attributes['data-rainbow-banner-month'].value, 10)
                break;
            default:
                break;
        }
        if (shown) {
            var banner = document.createElement('div')

            banner.style.setProperty('--gradient', `linear-gradient(90deg, ${document.body.attributes['data-rainbow-banner-colors'].value})`)
            banner.classList.add('rainbow-banner')

            navEl.after(banner)
        }
    }

    if (document.body.attributes['data-toc']) {
        const content = document.getElementsByClassName('content')[0]
        const maxDepth = document.body.attributes['data-toc-max-depth'].value

        var headingSelector = ''
        for (var i = 1; i <= maxDepth; i++) {
            headingSelector += 'h' + i + ','
        }
        headingSelector = headingSelector.slice(0, -1)
        const headings = content.querySelectorAll(headingSelector)

        var source = []
        headings.forEach((heading) => {
            source.push({
                html: heading.innerHTML,
                href: heading.getElementsByClassName('headerlink')[0].attributes['href'].value
            })
        })

        const toc = document.createElement('div')
        toc.classList.add('toc')
        for (const i in source) {
            const item = document.createElement('p')
            const link = document.createElement('a')
            link.href = source[i].href
            link.innerHTML = source[i].html
            link.removeChild(link.getElementsByClassName('headerlink')[0])
            item.appendChild(link)
            toc.appendChild(item)
        }

        if (toc.children.length != 0) {
            document.getElementsByClassName('post')[0].getElementsByClassName('divider')[0].after(toc)
            const divider = document.createElement('div')
            divider.classList.add('divider')
            toc.after(divider)
        }
    }
})()