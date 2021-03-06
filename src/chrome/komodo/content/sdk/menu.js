(function(){

    var $ = require("ko/dom");

    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    this.context = {
        editorContext: "#editorContextMenu"
    }

    this.register = (label, command, opts) =>
    {
        if ((typeof label) == "object")
        {
            opts = label;
        }
        else
        {
            opts.label = label;
            opts.command = command;
        }

        opts = _extend({
            image: "",
            command: function() {},
            classList: "",
            context: []
        }, opts);

        if ( ! ("label" in opts))
        {
            throw new exceptionMissingProp("label");
        }

        if ( ! ("id" in opts))
        {
            opts.id = opts.label;
        }

        opts.id = opts.id.replace(/\W+/g, "");

        var context = _parseContext(opts.context);
        for (let i=0;i<context.length;i++)
        {
            _register(opts, context[i]);
        }
    };

    this.unregister = (id, opts) =>
    {
        id = id.replace(/\W+/g, "");

        var context = _parseContext(opts.context);
        for (let i=0;i<context.length;i++)
        {
            let contextOpts = context[i];
            let _context = $(contextOpts.select);
            if ( ! context || ! context.length || context.element().nodeName != "menupopup")
                throw new exceptionInvalidContext(contextOpts.select || "null");

            _context.find("sdk_menuitem_" + contextOpts.uniqueId() + opts.id).remove();
        }
    }

    var _register = (opts, contextOpts) =>
    {
        if ((typeof contextOpts) == "string")
        {
            contextOpts = {select: contextOpts};
        }

        var context = $(contextOpts.select);
        if ( ! context.length || context.element().nodeName != "menupopup")
            throw new exceptionInvalidContext();

        var id = "sdk_menuitem_" + context.uniqueId() + opts.id;
        context.find(id).remove();

        var menuitem = document.createElementNS(XUL_NS, 'menuitem');
        menuitem.setAttribute("id", id);
        menuitem.setAttribute("label", opts.label);
        menuitem.setAttribute("image", opts.image);
        menuitem.setAttribute("class", opts.classList);

        menuitem.addEventListener("command", opts.command);
        menuitem.classList.add("sdk-menuitem");

        menuitem.sdkOpts = opts;

        var sibling, appended;
        if (contextOpts.before || contextOpts.after)
        {
            sibling = context.find(contextOpts.before || contextOpts.after);
            if (sibling.length)
            {
                sibling[contextOpts.before ? 'before' : 'after'](menuitem);
                appended = true;
            }
        }

        if ( ! appended)
        {
            context.append(menuitem);
        }

        placeMenuEventListener(context);
    }

    var _parseContext = (context) =>
    {
        if ( ! Array.isArray(context))
        {
            context = [context];
        }

        for (let i=0;i<context.length;i++)
        {
            if ((typeof context[i]) == "string")
            {
                context[i] = {select: context[i]};
            }
        }

        return context;
    }

    var placeMenuEventListener = (context) =>
    {
        if ("sdkMenuListener" in context)
        {
            return;
        }

        context.sdkMenuListener = true;

        context.on("popupshowing", (e) =>
        {
            context.find(".sdk-menuitem").each(function ()
            {
                if ( ! ("sdkOpts" in this)) return;
                var opts = this.sdkOpts;

                if (("isEnabled" in opts))
                {
                    if (! opts.isEnabled(e, context, this))
                    {
                        this.setAttribute("disabled", "true");
                    }
                    else
                    {
                        this.removeAttribute("disabled");
                    }
                }

                if (("isVisible" in opts))
                {
                    if (! opts.isVisible(e, context, this))
                    {
                        this.setAttribute("collapsed", "true");
                    }
                    else
                    {
                        this.removeAttribute("collapsed");
                    }
                }
            });
        });
    }

    function exceptionInvalidContext(context)
    {
        this.message = "The context cannot be found or is not a menupopup";
    }
    this.exceptionInvalidContext = exceptionInvalidContext;

    function exceptionMissingProp(prop)
    {
        this.message = "Menu registration failed due to missing " + prop + " property";
    }
    this.exceptionMissingProp = exceptionMissingProp;

    var _extend = () =>
    {
        var ob = {};
        for (let k in arguments)
        {
            let _ob = arguments[k];
            for (let _k in _ob)
            {
                if ( ! _ob.hasOwnProperty(_k)) continue;
                ob[_k] = _ob[_k];
            }
        };
        return ob;
    }

}).apply(module.exports);
