declare let Config: {
    DEBUG: boolean;
    LIB_VERSION: string;
};
declare let win: any;
declare let ArrayProto: any[];
declare let FuncProto: Function;
declare let ObjProto: Object;
declare let slice: (start?: number, end?: number) => any[];
declare let toString: () => string;
declare let hasOwnProperty: (v: string) => boolean;
declare let windowConsole: any;
declare let navigator$1: any;
declare let document$1: any;
declare let userAgent: any;
declare let nativeBind: (this: Function, thisArg: any, ...argArray: any[]) => any;
declare let nativeForEach: (callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any) => void;
declare let nativeIndexOf: (searchElement: any, fromIndex?: number) => number;
declare let nativeIsArray: (arg: any) => arg is any[];
declare let breaker: {};
declare let _: {
    trim(str: any): any;
};
declare let console$1: {
    log(): void;
    error(): void;
    critical(): void;
};
declare let ELEMENT_NODE: number;
declare let TEXT_NODE: number;
declare let autotrack: {
    _initializedTokens: any[];
    _previousElementSibling(el: any): any;
    _loadScript(scriptUrlToLoad: any, callback: any): void;
    _getClassName(elem: any): any;
    _getPropertiesFromElement(elem: any): {
        classes: any;
        tag_name: any;
    };
    _isTag(el: any, tag: any): boolean;
    _shouldTrackDomEvent(element: any, event: any): boolean;
    _getDefaultProperties(eventType: any): {
        $event_type: any;
        $ce_version: number;
        $host: string;
        $pathname: string;
    };
    _getInputValue(input: any): any;
    _getSelectValue(select: any): any;
    _includeProperty(input: any, value: any): boolean;
    _getFormFieldValue(field: any): any;
    _getFormFieldProperties(form: any): {};
    _extractCustomPropertyValue(customProperty: any): string;
    _getCustomProperties(targetElementList: any): {};
    _getEventTarget(e: any): any;
    _trackEvent(e: any, instance: any): boolean;
    _navigate(href: any): void;
    _addDomEventHandlers(instance: any): void;
    _customProperties: {};
    init(instance: any): void;
    _editorParamsFromHash(instance: any, hash: any): any;
    _maybeLoadEditor(instance: any): boolean;
    _loadEditor(instance: any, editorParams: any): boolean;
    enabledForProject(token: any, numBuckets: any, numEnabledBuckets: any): boolean;
    isBrowserSupported(): any;
};
declare let init_type: any;
declare let mixpanel_master: any;
declare let INIT_MODULE: number;
declare let INIT_SNIPPET: number;
declare let PRIMARY_INSTANCE_NAME: string;
declare let SET_QUEUE_KEY: string;
declare let SET_ONCE_QUEUE_KEY: string;
declare let ADD_QUEUE_KEY: string;
declare let APPEND_QUEUE_KEY: string;
declare let UNION_QUEUE_KEY: string;
declare let SET_ACTION: string;
declare let SET_ONCE_ACTION: string;
declare let ADD_ACTION: string;
declare let APPEND_ACTION: string;
declare let UNION_ACTION: string;
declare let PEOPLE_DISTINCT_ID_KEY: string;
declare let ALIAS_ID_KEY: string;
declare let CAMPAIGN_IDS_KEY: string;
declare let EVENT_TIMERS_KEY: string;
declare let RESERVED_PROPERTIES: string[];
declare let HTTP_PROTOCOL: string;
declare let USE_XHR: boolean;
declare let ENQUEUE_REQUESTS: boolean;
declare let DEFAULT_CONFIG: {
    api_host: string;
    app_host: string;
    autotrack: boolean;
    cdn: string;
    cross_subdomain_cookie: boolean;
    persistence: string;
    persistence_name: string;
    cookie_name: string;
    loaded(): void;
    store_google: boolean;
    save_referrer: boolean;
    test: boolean;
    verbose: boolean;
    img: boolean;
    track_pageview: boolean;
    debug: boolean;
    track_links_timeout: number;
    cookie_expiration: number;
    upgrade: boolean;
    disable_persistence: boolean;
    disable_cookie: boolean;
    secure_cookie: boolean;
    ip: boolean;
    property_blacklist: any[];
};
declare let DOM_LOADED: boolean;
declare let DomTracker: () => void;
declare let LinkTracker: () => void;
declare let FormTracker: () => void;
declare let MixpanelPersistence: (config: any) => void;
declare let MixpanelLib: () => void;
declare let MixpanelPeople: () => void;
declare let MPNotif: any;
declare let create_mplib: (token: any, config: any, name: any) => any;
declare let instances: {};
declare let extend_mp: () => void;
declare let override_mp_init_func: () => void;
declare let add_dom_loaded_handler: () => void;
declare let add_dom_event_counting_handlers: (instance: any) => void;
declare function init_as_module(): any;
declare let mixpanel: any;
