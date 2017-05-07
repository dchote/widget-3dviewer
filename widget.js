/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript
requirejs.config({
    paths: {
        Three: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r85/three',
        
        ThreeTrackballControls: 'https://cdn.rawgit.com/mrdoob/three.js/dev/examples/js/controls/TrackballControls',
        ThreeTween: 'https://cdn.rawgit.com/tweenjs/tween.js/master/src/Tween',
        
        ThreeProjector: 'https://cdn.rawgit.com/mrdoob/three.js/dev/examples/js/renderers/Projector',
    },
    shim: {
        Three: {
            exports: 'THREE'
        },
        ThreeTrackballControls: {
            deps: ['Three'],
        },
        ThreeTween: {
            deps: ['Three'],
        },
        ThreeProjector: {
            deps: ['Three'],
        },
    }
});

cprequire_test(['inline:com-chilipeppr-widget-3dviewer'], function (threed) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    console.log("Running 3dviewer");
    
    // set my title while in test mode so it's pretty
    $('title').html(threed.name);
    
    // actually finally init me
    threed.init({doMyOwnDragDrop: true});
    
    // test resize signal
    setTimeout(function() {
            chilipeppr.publish('/' + threed.id + '/resize', "" );
    }, 3000);
    //dragdrop
    $('body').prepend('<div id="test-drag-drop"></div>');
    chilipeppr.load("#test-drag-drop", "http://fiddle.jshell.net/chilipeppr/Z9F6G/show/light/",

    function () {
        cprequire(
        ["inline:com-chilipeppr-elem-dragdrop"],

        function (dd) {
            dd.init();
            dd.bind("body", null);
        });
    });
    
    // flashmsg
    $('body').prepend('<div id="com-chilipeppr-flash"></div>');
    chilipeppr.load("#com-chilipeppr-flash",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",

    function () {
        console.log("mycallback got called after loading flash msg module");
        cprequire(["inline:com-chilipeppr-elem-flashmsg"], function (fm) {
            fm.init();
        });
    });
    
    var testGotoline = function() {
        // send sample gcodeline commands as if the gcode sender widget were sending them
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/gotoline', {line: 3, gcode: "G21 G90 G64 G40"} );
        }, 3000);
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/gotoline', {line: 4, gcode: "G0 Z3.0"}  );
        }, 6000);
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/gotoline', {line: 10, gcode: "G0 X130.8865 Y-11.5919"} );
        }, 9000);
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/gotoline', {line: 11, gcode: "G0 Z1.5"} );
        }, 12000);
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/gotoline', {line: 22, gcode: "G1 F300.0 Z0.0"}  );
        }, 12800);
    }
    
    var testGotoXyz = function() {
        // send sample gcodeline commands as if the gcode sender widget were sending them
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/axes', {x:0.0, y:0.0, z:10.0} );
        }, 3000);
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/axes', {z:-2.0} );
        }, 4000);
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/axes', {x:0.0, z:6.0} );
        }, 55000);

    }
    
    var testClear = function() {
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/sceneclear' );
        }, 5000);
    }
    //testClear();
    
    var testViewExtents = function() {
        setTimeout(function() {
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/viewextents' );
        }, 5000);
    }
    //testViewExtents();
    
    //testGotoXyz();
    
    //threed.init();
    console.log("3d viewer initted");
} /*end_test*/ );

// Bring THREE in to global scope
cpdefine('Three', ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r83/three.js'], function ( THREE ) {
    if (typeof window !== 'undefined') {
        window.THREE = THREE;
        return THREE;
    }
});

cpdefine('inline:com-chilipeppr-widget-3dviewer', ['chilipeppr_ready', 'Three', 'ThreeTrackballControls', 'ThreeTween', 'ThreeProjector'], function () {

    return {

        id: 'com-chilipeppr-widget-3dviewer',
        name: "Widget / 3D GCode Viewer",
        desc: "Visualize your GCode in 3D by simulating your GCode run or seeing where your run is at in 3D while your CNC operation is in action.",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        publish: {
            '/recv3dObject' : "When you send a /request3dObject you will receive a signal back of /recv3dObject. This signal has a payload of the THREE.js user object being shown in the 3D viewer.",
            '/recvUnits' : 'When you send a /requestUnits you will receive back this signal with a payload of "mm" or "inch" as a string. Please also see /unitsChanged in case you want to know whenever units are changed from a file open event. You can request what units the Gcode are in from the 3D Viewer. Since the 3D Viewer parses Gcode, it can determine the units. The 3D Viewer is mostly unit agnostic, however to draw the toolhead, grid, and extents labels it does need to know the units to draw the decorations in a somewhat appropriate size.',
            '/unitsChanged' : 'This signal is published when the user loads a new file into the 3D viewer and the units change. If other widgets need to know what units are being used, you should subscribe to this signal to be notified on demand.',
            '/sceneReloaded' : "This signal is sent when the scene has been (re)load because the user dragged / dropped. The payload indicates the global bounding box of the scene. This signal is similar to listening to /com-chilipeppr-elem-dragdrop/ondropped however, /sceneReloaded is guaranteed to fire every time the 3D viewer loads a new file into the viewer. Credit for this signal goes to Dat Chu who created it for his GrblLaser workspace."
            
        },
        subscribe: {
            '/gotoline': "This widget subscribes to this channel so other widgets can move the toolhead and highlight the Gcode line being worked on. This would mostly be when sending Gcode from a Gcode viewer/sender widget, that widget can have the 3D view follow along. Just the line number should be sent as the 3D viewer has it's own cache of the Gcode data loaded.",
            '/resize' : "You can ask this widget to resize itself. It will resize the rendering area to the region it is bound to (typically the window width/height).",
            '/sceneadd' : "You can send Threejs objects to this widget and they will be added to the scene. You must send true THREE.Line() or other ThreeJS objects in that are added as scene.add() objects.",
            '/sceneremove' : "You can also remove objects from the 3D scene. This is the opposite of /sceneadd",
            '/sceneclear' : "This resets the 3D viewer and clears the scene. It keeps the axes, toolhead, and grid. The user object and extents is removed.",
            '/drawextents' : "This asks the 3D viewer to draw the extents of what it is showing.",
            '/viewextents' : "This asks the 3D viewer to place the entire 3D object set in the view window from a front facing position. It is the equivalent of the button with the \"eye\" icon in the toolbar.",
            '/setunits' : "Pass in a string of \"mm\" or \"inch\" to set the units for the 3D Viewer.",
            '/wakeanimate' : "The 3d viewer sleeps the rendering after 5 seconds. So if you are going to do any updates to the 3D scene you should wake the animation before your update. It will timeout on its own so you don't have to worry about it. /sceneadd and /sceneremove do their own waking so you don't need to ask for it on those.",
            '/request3dObject' : "You can request the parent-most object that is showing in the 3D viewer. This is a THREE.js object that is generated by the 3D viewer. It contains all user elements shown in the scene. It does not contain the XYZ axis, toolhead, or other system elements. When you send this signal you will receive a publish back on /recv3dObject",
            '/requestUnits' : 'Send in this signal and you will be sent back a /recvUnits with a payload of "mm" or "inch" as a string. Please also see /unitsChanged in case you want to know whenever units are changed from a file open event. You can request what units the Gcode are in from the 3D Viewer. Since the 3D Viewer parses Gcode, it can determine the units. The 3D Viewer is mostly unit agnostic, however to draw the toolhead, grid, and extents labels it does need to know the units to draw the decorations in a somewhat appropriate size.'
        },
        foreignSubscribe: {
            "/com-chilipeppr-interface-cnccontroller/axes" : "If we see this signal come in, we move the toolhead to the xyz position in the payload of the signal.",
            "/com-chilipeppr-elem-dragdrop/ondropped" : "When a user drags and drops a file to the main window, we want to get notified so we can load it into the 3D viewer. During development mode in JSFiddle, this widget loads it's own com-chilipeppr-elem-dragdrop so you can test development, but when this widget is loaded in a full ChiliPeppr app it uses the global com-chilipeppr-elem-dragdrop."
        },
        foreignPublish: {
        },
        
        // Variables and states
        initOptions: {},
        
        onSignalSceneReloadedFailAttempts: 0, // track failed nulls
        
        domElement: null,
        scene: null,
        object: null,
        camera: null,
        controls: null,
        toolhead: null,
        decorate: null, // stores the decoration 3d objects
        shadowplane: null, // where the toolhead shadow is rendered
        grid: null, // stores grid
        axes: null, // global property to store axes that we drew
        element: null, // scene element
        
        parsedLines: [],
        lineObjects: [],
        
        sceneCenter: null,
        sceneBoundaries: null,
        
        isUnitsMm: true, // true for mm, false for inches
        
        
        // animation state
        animationLatencyTimer: null,
        animationLatencyDelay: 32,
        animationLatencyDelayDefault: 32,
        
        inspectLatencyTimer: null,
        inspectLatencyDelay: 200,
        
        jogLatencyTimer: null,
        jogLatencyDelay: 200,
        
        moveAnimate: false,
        tweenAnimate: false,
        inspectAnimate: false,
        
        // render state & fps tracking
        fpsCalculationTimer: null,
        renderFrameCount: 0, // keep track of fps
        
        tween: null,
        tweenHighlight: null,
        tweenIndex: null,
        tweenSpeed: 1,
        tweenPaused: false,
        tweenIsPlaying: false,
        
        
        zheighttest: 0, // test toolhead going up in z
        textFont: false, // three.js font object
        
        isInspectSelect: false,
        inspectArrowGrp: null,
        inspectCurPos: null,
        inspectLastObj: {uuid:""},
        inspectLastDecorateGroup: null,
        inspectDlgEl: null,
        
        isJogBtnAttached: false, // is the jog btn setup?
        isJogSelect: false, // indicates we're in 3d jog mode
        arrowHelper: null,
        jogPlane: null,
        isJogRaycaster: false,
        jogArrow: null,
        jogArrowCyl: null,
        jogArrowLine: null,
        jogArrowShadow: null,
        jogCurPos: null,
        
        // basic properties
        colorBackground: 0xeeeeee, // this is the background color of the 3d viewer
        colorG0: 0x00ff00,
        colorG1: 0x0000ff,
        colorG2: 0x999900,
        colorArc: 0x0099ff,
        colorActive: 0xff00ff,
        colorCompleted: 0x000000,
        colorGhosted: 0x000000,
        lineWidth: 1,
        
        // options
        disableAnimation: false, // boolean tracking whether we allow animation
        
        disableAA: false,
        showShadow: true,
        
        gridSize: 1, // global property for size of grid. default to 1 (shapeoko rough size)
        isLookAtToolHeadMode: false,
        
        
        init: function (initOptions) {
            this.initOptions = initOptions;
            
            var that = this;
            
            // download the font we'll use to render text
            this.downloadFont();
            
            // Drop files from desktop onto main page to import them.
            // We also can subscribe to the main chilipeppr drag/drop
            // pubsub to get drop events from a parent, rather than doing
            // this on our own
            
            
            // subscribe to file load events
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondropped", this, this.onPubSubFileLoaded);
            
            if (this.initOptions && this.initOptions.doMyOwnDragDrop) {
                console.log("Doing my own drag drop for 3D viewer cuz asked to. Attaching to body tag in DOM.");
                $('body').on('dragover', function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    event.originalEvent.dataTransfer.dropEffect = 'copy'
                }).on('drop', function (event) {
                    console.log("got drop:", event);
                    event.stopPropagation();
                    event.preventDefault();
                    var files = event.originalEvent.dataTransfer.files;
                    if (files.length > 0) {
                        var reader = new FileReader();
                        
                        reader.onload = function () {
                            console.log("opening file. reader:", reader);
                            console.log ("stringify", JSON.stringify(reader.result, null, 2));
                            that.openGCodeFromText(reader.result);
                        };
                        
                        reader.readAsText(files[0]);
                    }
                });
            }
            
            
            // Load existing state/options from localStorage
            this.disableAA = (localStorage.getItem('disable-aa') == 'true') ? true : false;
            this.showShadow = (localStorage.getItem('toolhead-shadow') == 'true' ? true : false);
            this.disableAnimation = (localStorage.getItem('disable-animation') == 'true' ? true : false);
                        
            // setup the scene and attempt to load the last object
            
            this.domElement = $('#com-chilipeppr-widget-3dviewer-renderArea');
            this.scene = this.createScene(this.domElement);
            
            // TODO: maybe we dont do this, instead have the gcode widget tell us what we should do, maybe we just show the chilipeppr logo regardless.
            var lastImported = localStorage.getItem('last-imported');
            var lastLoaded = localStorage.getItem('last-loaded');
            if (lastImported) {
                this.openGCodeFromText(lastImported);
            } else {
                this.openGCodeFromPath(lastLoaded || 'http://www.chilipeppr.com/3d/chilipepprlogo.nc');
            }
            
            
            // setup toolbar buttons and menu state
            this.btnSetup();
            this.setupCogMenu();
            this.setCogMenuState();
            this.setupGridSizeMenu();
            
            this.initJog();
            this.initInspect();
            
            
            // Download and attach the Fork Widget elements in the dropdown
            this.forkSetup();
            
            // draw our workspace            
            this.drawAxesToolAndExtents()
            
            
            // subscribe to gotoline signal so we can move toolhead to correct location
            // to sync with the gcode sender
            chilipeppr.subscribe('/' + this.id + '/gotoline', this, this.gotoLine);

            // subscribe to gotoline signal so we can move toolhead to correct location
            // to sync with the actual milling machine
            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/axes', this, this.gotoXyz);
            
            // we can be asked to resize ourself by a publish call to this signal
            chilipeppr.subscribe('/' + this.id + '/resize', this, this.resize);
            
            // requestUnits, recvUnits
            chilipeppr.subscribe("/" + this.id + "/requestUnits", this, this.requestUnits);
            
            // setup more pubsub to allow other widgets to inject objects to our scene
            this.setupScenePubSub();
            
            // hide the pan/zoom/orbit msg after 1 minute
            setTimeout(function() {
                console.log("hiding pan/zoom/orbit msg");
                $('.com-chilipeppr-widget-3dviewer-panzoom-indicator').fadeOut("slow"); //addClass("hidden");
            }, 60 * 1000);
            
        },
        setupScenePubSub: function() {
            // these pubsubs let others add objects to our 3d scene
            // TODO: wakeAnimate change
            chilipeppr.subscribe("/" + this.id + "/wakeanimate", this, this.animate);
            chilipeppr.subscribe("/" + this.id + "/sceneadd", this, this.sceneAdd);
            chilipeppr.subscribe("/" + this.id + "/sceneremove", this, this.sceneRemove);
            chilipeppr.subscribe("/" + this.id + "/sceneclear", this, this.sceneClear);
            chilipeppr.subscribe("/" + this.id + "/drawextents", this, this.drawAxesToolAndExtents);
            chilipeppr.subscribe("/" + this.id + "/viewextents", this, this.viewExtents);
            chilipeppr.subscribe("/" + this.id + "/setunits", this, this.setUnits);
            
            chilipeppr.subscribe("/" + this.id + "/request3dObject", this, this.request3dObject);
        },

        onSignalSceneReloaded: function () {
            if (this.object && this.sceneBoundaries != null) {
                console.log("publishing /sceneReloaded. It took us X attempts:", this.onSignalSceneReloadedFailAttempts);
                chilipeppr.publish("/" + this.id + "/sceneReloaded", this.sceneBoundaries);
                this.onSignalSceneReloadedFailAttempts = 0;
            } else {
                // call ourselves again in 2 seconds
                if (this.onSignalSceneReloadedFailAttempts >= 5) {
                    // give up
                    console.log("tried 5 times onSignalSceneReloadedFailAttempts. giving up.");
                    this.onSignalSceneReloadedFailAttempts = 0;
                } else {
                    this.onSignalSceneReloadedFailAttempts++;
                    setTimeout(this.onSignalSceneReloaded.bind(this), 2000);
                }
            }
        },

        initInspect: function() {
            // attach click event
            console.log("doing one time run of initial inspect setup. this should not run more than once!!!");
            $('.com-chilipeppr-widget-3d-menu-inspect').click(this.toggleInspect.bind(this));
                
            // attach shortcut key
            var el = this.domElement;
            el.focus();
            
            $(document).keydown(this.inspectKeyDown.bind(this));
            $(document).keyup(this.inspectKeyUp.bind(this));
            
            this.inspectLastDecorateGroup = new THREE.Group();
            this.sceneAdd(this.inspectLastDecorateGroup);
            
            // get dialog element
            this.inspectDlgEl = $('.com-chilipeppr-widget-3dviewer-inspect');
            // setup click event
            this.inspectDlgEl.find('.inspect-btn-goto').click(this.onInspectGoto.bind(this));
            this.inspectDlgEl.find('.close').click(function() {
                $('.com-chilipeppr-widget-3dviewer-inspect').addClass("hidden");
            });
            
            // create three.js group to hold all preview lines
            this.inspectPreviewGroup = new THREE.Group();
            
            
        },
        setupInspect: function(evt) {
            console.log("setupInspect.");
            
            if (this.isInspectSelect) {
                console.log("we are already in inspect mode. being asked to setup, but returning cuz u can't setup more than once.");
                return;
            }
            
            // start watching mouse
            var el = this.domElement;
            el.mousemove(this.inspectMouseMove.bind(this));
            el.click(this.inspectMouseClick.bind(this));
            $('.com-chilipeppr-widget-3d-menu-inspect').addClass("active");
            $('.com-chilipeppr-widget-3d-menu-inspect').addClass("btn-primary");
            
            if (this.inspectArrowGrp != null) {
                this.sceneAdd(this.inspectArrowGrp);
            }
            
            this.sceneAdd(this.inspectPreviewGroup);
            
            this.isInspectSelect = true;
        },
        unsetupInspect: function() {
            console.log("unsetupInspect");
            
            if (!this.isInspectSelect) {
                console.log("we are being asked to unsetup inspect, but it is not running so why are we getting called?");
                return;
            }
            
            var el = this.domElement;
            el.unbind("mousemove");
            el.unbind("click");
            
            $('.com-chilipeppr-widget-3d-menu-inspect').removeClass("active");
            $('.com-chilipeppr-widget-3d-menu-inspect').removeClass("btn-primary");
            //this.unsetupJogRaycaster();
            
            if (this.inspectArrowGrp != null) {
                this.sceneRemove(this.inspectArrowGrp);
                //this.inspectArrowGrp.visible = false;
            }
            
            //this.inspectDlgEl.addClass("hidden");
            
            this.sceneRemove(this.inspectPreviewGroup);
            this.isInspectSelect = false;
        },
        toggleInspect: function(evt) {
            if ($('.com-chilipeppr-widget-3d-menu-inspect').hasClass("active")) {
                // turn off
                this.unsetupInspect(evt);
            } else {
                this.setupInspect(evt);
            }
        },
        inspectKeyDown: function(evt) {
            if ((evt.shiftKey)  && !this.isInspectSelect) {
                // TODO: wakeAnimate change
                this.animate();
                this.setupInspect(evt);
            }
        },
        inspectKeyUp: function(evt) {
            if ((evt.keyCode == 16) && this.isInspectSelect) {
                this.unsetupInspect(evt);
            }
        },
        inspectMouseClick: function(evt) {
            console.log("inspectMouseClick. evt:", evt);
            return;
            if (evt.ctrlKey || evt.altKey) {
                if (this.jogCurPos != null) {
                    var pt = this.jogCurPos;
                    var gcode = "G90 G0 X" + pt.x.toFixed(3) + " Y" + pt.y.toFixed(3);
                    gcode += "\n";
                    chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gcode);
                } else {
                    console.warn("this.jogCurPos should not be null");
                }
            }
        },
        onInspectGoto: function(evt) {
            if (this.inspectLastObj.uuid != "") {
                var lineNum = this.inspectLastObj.userData.args.indx + 1;
                chilipeppr.publish("/com-chilipeppr-widget-gcode/jumpToLine", lineNum);
            }
        },
        createInspectArrow: function() {
            if (this.inspectArrowGrp != null) return;
            
            // build pointer line
            this.inspectArrowGrp = new THREE.Group();
            
            // Looks better without the line

            this.sceneAdd(this.inspectArrowGrp);
            console.log("just added inspectArrowGrp:", this.inspectArrowGrp);

        },
        inspectMouseMove: function(evt) {
            if (!this.isInspectSelect || this.inspectLatencyTimer) {
                return;
            }
            
            var mouse = {};
            mouse.x = ( ( event.clientX - this.domElement.offset().left ) / this.domElement.width() ) * 2 - 1;
            mouse.y = - ( ( event.clientY - this.domElement.offset().top ) / this.domElement.height() ) * 2 + 1;
            
            // dialog position
            var x = event.clientX - this.domElement.offset().left;
            var y = event.clientY - this.domElement.offset().top;
            
            x += 50; // slide right to clear mouse
            y += -100;
            
            var that = this;
            
            this.inspectLatencyTimer = setTimeout(function() {
                that.createInspectArrow();
            
                var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( that.camera );
        
                var origin = that.camera.position.clone();
                var dir = vector.sub( that.camera.position ).normalize();
        
                var raycaster = new THREE.Raycaster( origin, dir );
                raycaster.linePrecision = 0.5;
        
                var io = raycaster.intersectObjects(that.lineObjects, true);
            
                if (io.length > 0) {
                    // we hit some objects
                    var obj = io[0];
                
                    // see if this is a new object we haven't hit yet
                    if (that.inspectLastObj.uuid != obj.object.uuid) {
                    
                        var o = obj.object;
                        var ud = o.userData;
                    
                        console.log("hit new object:", o, ud);
                    
                        // remove all previous preview items
                        that.inspectPreviewGroup.children.forEach(function(threeObj) {
                            that.inspectPreviewGroup.remove(threeObj);
                        }, that);
                    
                        // create glow
                        var glow = that.createGlow(o);
                        that.inspectPreviewGroup.add(glow);
                    
                        that.inspectDlgEl.css('left', x + "px").css('top', y + "px");
                        that.inspectDlgEl.find('.inspect-line').text(ud.args.indx + 1);
                        that.inspectDlgEl.find('.inspect-gcode').text(ud.args.origtext);
                        that.inspectDlgEl.find('.inspect-end').text("X:" + ud.p2.x + ", Y:" + ud.p2.y + ", Z:" + ud.p2.z);
                        that.inspectDlgEl.find('.inspect-feedrate').text(ud.p2.feedrate);
                        that.inspectDlgEl.find('.inspect-distance').text(ud.p2.dist.toFixed(3));
                        that.inspectDlgEl.find('.inspect-time').text((ud.p2.timeMins * 60).toFixed(2) + "s");
                    
                        var pretty = that.convertMinsToPrettyDuration(ud.p2.timeMinsSum);
                        that.inspectDlgEl.find('.inspect-timeSum').text(pretty);
                        that.inspectDlgEl.removeClass("hidden");
                    
                        // set the last object to this one
                        that.inspectLastObj = o;
                    }
                
                    var pt = io[0].point;
                    // move arrow
                    that.inspectArrowGrp.position.set(pt.x, pt.y, 0);
                    that.inspectCurPos = pt.clone();
                
                
                } else if (false) {
                    console.log("nothing hit. resetting inspectLastObj:", that.inspectLastObj);
                    if (that.inspectLastObj.uuid != "") {
                    
                        // remove everything from this.inspectPreviewGroup
                        that.inspectPreviewGroup.children.forEach(function(threeObj) {
                            that.inspectPreviewGroup.remove(threeObj);
                        }, that);
                        
                        //that.sceneRemove(this.inspectLastObj);
                        that.inspectLastObj.material.color = 0x0000ff;
                        that.inspectLastObj.material.opacity = this.inspectLastOpacity;
                        that.inspectLastObj = {uuid:""};
                        
                        // hide dialog
                        that.inspectDlgEl.addClass("hidden");
                    }
                }
            
                that.inspectAnimate = true;
                that.animate();
                that.inspectAnimate = false;
                
                that.inspectLatencyTimer = null;
            }, this.inspectLatencyDelay);
            
        },
        
        createGlow: function(threeObj) {
            console.log("createGlow. threeObj:", threeObj);
            
            var obj = new THREE.Group();
            if (threeObj instanceof THREE.Line) {
                if (!(threeObj.geometry instanceof THREE.BufferGeometry)) {
                    console.log('nope');
                    return;
                }
                
                try {
                    console.log('createGlow geometry:', threeObj.geometry);
                    
                    var objGeometry = new THREE.Geometry().fromBufferGeometry(threeObj.geometry);              
                    
                    // draw a cube at each end point
                    var v1 = objGeometry.vertices[0];
                    var v2 = objGeometry.vertices[objGeometry.vertices.length - 1];
                    
                    var length = v1.distanceTo(v2);
                    var dir = v2.clone().sub(v1).normalize();
                    var ray = new THREE.Ray(v1, dir);
                
                    var geometry = new THREE.CylinderGeometry( 1, 1, length );
                    var material = new THREE.MeshNormalMaterial( {
                        //color: 0x00ff00,
                        transparent: true,
                        opacity: 0.1
                    } );
                
                    var cylinder = new THREE.Mesh( geometry, material );
                
                    // figure out rotation
                    var arrow = new THREE.ArrowHelper( dir, v1, length, 0xff0000 );
                    obj.add(arrow);
                
                    var rot = arrow.rotation.clone()
                    cylinder.rotation.set(rot.x, rot.y, rot.z);
                
                    var cpos = ray.at(length/2);
                    cylinder.position.set(cpos.x, cpos.y, cpos.z);

                    console.log("adding cylinder:", cylinder);
                    obj.add(cylinder);
                    
                } catch(err) {
                    // this is because threejs has a bug, or sloppy code in regards to fromBufferGeometry
                    console.log('createGlow error', err, threeObj.geometry);
                }
                
            } else {
                console.log("threeObj not Line");
            }
            
            return obj;
        },
        createGlowCubeCaps: function(threeObj) {
            console.log("createGlow. threeObj:", threeObj);
            
            var obj = new THREE.Group();
            if (threeObj instanceof THREE.Line) {
                if (!(threeObj.geometry instanceof THREE.BufferGeometry)) {
                    return;
                }
                
                console.log("threeObj is Line");
                try {
                    var objGeometry = new THREE.Geometry().fromBufferGeometry(threeObj.geometry);
                          
                    // draw a cube at each end point
                    var v1 = objGeometry.vertices[0];
                    var v2 = objGeometry.vertices[geometry.vertices.length - 1];
                
                    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
                    var material = new THREE.MeshNormalMaterial( {
                        //color: 0x00ff00,
                        transparent: true,
                        opacity: 0.1
                    } );
                
                    var cube = new THREE.Mesh( geometry, material );
                    cube.position.set(v1.x, v1.y, v1.z);
                
                    var cube2 = cube.clone();
                    cube2.position.set(v2.x, v2.y, v2.z);
                
                    console.log("adding cube:", cube, "cube2:", cube2);
                
                    obj.add(cube);
                    obj.add(cube2);
                } catch(err) {
                    // this is because threejs has a bug, or sloppy code in regards to fromBufferGeometry
                    console.log('createGlowCubeCaps error', err, threeObj.geometry);
                }
            } else {
                console.log("threeObj not Line");
            }
            
            return obj;
        },
        

        // JOG CODE REGION
        initJog: function() {
            if (!this.isJogBtnAttached) {
                // attach click event
                console.log("doing one time run of initial jog setup. this should not run more than once!!!");
                
                $('.com-chilipeppr-widget-3d-menu-jog').click(this.toggleJog.bind(this));
                
                var el = this.domElement;
                el.focus();
                
                $(document).keydown(this.jogKeyDown.bind(this));
                $(document).keyup(this.jogKeyUp.bind(this));
                
                this.isJogBtnAttached = true;
            }
        },
        setupJog: function(evt) {
            console.log("setupJog.");
            
            if (this.isJogSelect) {
                console.log("we are already in jogging mode. being asked to setup, but returning cuz u can't setup more than once.");
                return;
            }
            
            // start watching mouse
            var el = this.domElement;
            el.mousemove(this.jogMouseMove.bind(this));
            el.click(this.jogMouseClick.bind(this));
            
            $('.com-chilipeppr-widget-3d-menu-jog').addClass("active");
            $('.com-chilipeppr-widget-3d-menu-jog').addClass("btn-primary");
            
            // make sure animation stays on
            //this.gotoXyz({x:0,y:0,z:3});
            this.isJogSelect = true;
        },
        unsetupJog: function() {
            if (!this.isJogSelect) {
                console.log("we are being asked to unsetup jog, but it is not running so why are we getting called?");
                return;
            }
            
            var el = this.domElement;
            el.unbind("mousemove"); //this.jogMouseMove.bind(this));
            el.unbind("click");
            
            $('.com-chilipeppr-widget-3d-menu-jog').removeClass("active");
            $('.com-chilipeppr-widget-3d-menu-jog').removeClass("btn-primary");
            
            this.unsetupJogRaycaster();
            this.isJogSelect = false;
        },
        toggleJog: function(evt) {
            if ($('.com-chilipeppr-widget-3d-menu-jog').hasClass("active")) {
                // turn off
                this.unsetupJog(evt);
            } else {
                this.setupJog(evt);
            }
        },
        jogKeyDown: function(evt) {
            if ((evt.ctrlKey)  && !this.isJogSelect) {
                // TODO: wakeAnimate change
                this.setupJog(evt);
            } else {
                //console.log("we are already jogging. ignoring keydown.");
            }
        },
        jogKeyUp: function(evt) {
            if ((evt.keyCode == 17) && this.isJogSelect) {
                this.unsetupJog(evt);
            }
        },
        unsetupJogRaycaster: function() {
            this.sceneRemove(this.jogPlane);
            this.sceneRemove(this.jogArrow);
            
            this.isJogRaycaster = false;
            
            this.inspectAnimate = true;
            this.animate();
            this.inspectAnimate = false;
        },
        setupJogRaycaster: function() {
            console.log("doing setupJogRaycaster"); 
            console.log("mimic grid size:", this.grid);
            
            var helper = new THREE.BoxHelper(this.grid, 0xff0000);
            
            var box = new THREE.Box3();
            box.setFromObject(helper);
            
            console.log("boundingbox:", box);
            var w = box.max.x - box.min.x;
            var h = box.max.y - box.min.y;
            
            // create plane at z 0 to project onto
            var geometry = new THREE.PlaneBufferGeometry( w, h );
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
            this.jogPlane = new THREE.Mesh( geometry, material );
            
            console.group("draw jogArrow");
            
            // remove grid if drawn previously
            if (this.jogArrow != null) {
                console.log("there was a previous jogArrow. remove it. jogArrow:", this.jogArrow);
                
                this.sceneRemove(this.jogArrow);
            } else {
                console.log("no previous jogArrow.");
            }
            
            // TOOLHEAD WITH SHADOW
            var jogArrowGrp = new THREE.Object3D();
            
            // jogArrow Cylinder
            // API: THREE.CylinderGeometry(bottomRadius, topRadius, height, segmentsRadius, segmentsHeight)
            var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0, 5, 40, 15, 1, false), new THREE.MeshNormalMaterial());
            cylinder.overdraw = true;
            cylinder.rotation.x = -90 * Math.PI / 180;
            cylinder.position.z = 20;
            cylinder.material.opacity = 0.3;
            cylinder.material.transparent = true;
            cylinder.castShadow = true;
            
            // move the cylinder up in the group to account for z pos of toolhead
            // acct for scale
            var posZ = (this.toolhead.position.z * 3);
            cylinder.position.setZ(posZ + 20);
            this.jogArrowCyl = cylinder;
            jogArrowGrp.add(cylinder);
            
            // scale the whole thing to correctly match mm vs inches
            var scale = this.getUnitVal(1);
            jogArrowGrp.scale.set(scale / 3, scale / 3, scale / 3);

            // draw dotted lines from jog tip and shadow
            var lineMat = new THREE.LineDashedMaterial( { color: 0x000000, dashSize: 45, gapSize: 45 } );
            var lineGeo = new THREE.Geometry();
            
            lineGeo.vertices.push(new THREE.Vector3( 0, 0, 0 ));
            lineGeo.vertices.push(new THREE.Vector3( 0, 0, posZ ));
            
            var line = new THREE.Line(lineGeo, lineMat);
            
            this.jogArrowLine = line;
            jogArrowGrp.add(line);
            
            // add text
            var txt = "Ctrl Click to XY Jog Here";
            var txtObj = this.makeText({
                x: 4,
                y: (this.getUnitVal(7) / 2) *-1,
                z: 0,
                text: txt,
                color: 0x000000,
                opacity: 0.2,
                size: 7 //this.getUnitVal(7)
            });
            
            jogArrowGrp.add( txtObj );
            
            this.jogArrow = jogArrowGrp;
            this.sceneAdd(this.jogArrow);
            
            console.groupEnd();
            
            this.isJogRaycaster = true;
        },
        jogMouseClick: function(evt) {
            console.log("jogMouseClick. evt:", evt);
            if (evt.ctrlKey || evt.altKey) {
                if (this.jogCurPos != null) {
                    var pt = this.jogCurPos;
                    var gcode = "G90 G0 X" + pt.x.toFixed(3) + " Y" + pt.y.toFixed(3);
                    gcode += "\n";
                    chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gcode);
                } else {
                    console.warn("this.jogCurPos should not be null");
                }
            }
        },
        jogMouseMove: function(evt) {
            if (!this.isJogSelect || this.jogLatencyTimer) {
                return;
            }
            
            var mouse = {};
            mouse.x = ( ( event.clientX - this.domElement.offset().left ) / this.domElement.width() ) * 2 - 1;
            mouse.y = - ( ( event.clientY - this.domElement.offset().top ) / this.domElement.height() ) * 2 + 1;
            
            var that = this;
            this.jogLatencyTimer = setTimeout(function() {
                var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( that.camera );
            
                var origin = that.camera.position.clone();
                var dir = vector.sub( that.camera.position ).normalize();
            
                if (!that.isJogRaycaster && that.isJogSelect) {
                    that.setupJogRaycaster();
                }
            
                var raycaster = new THREE.Raycaster( origin, dir );

                var io = raycaster.intersectObject(that.jogPlane, false);
                //console.log("io:", io);
            
                if (io.length > 0) {
                    // we hit the jog plane
                    var pt = io[0].point;
                    // move arrow
                    that.jogArrow.position.set(pt.x, pt.y, 0);
                    that.jogCurPos = pt.clone();
                }
                
                that.inspectAnimate = true;
                that.animate();
                that.inspectAnimate = false;
                
                that.jogLatencyTimer = null;
            }, this.jogLatencyDelay);
        },

        setupCogMenu: function() {
            $('.com-chilipeppr-widget-3dviewer-settings-aa').click(this.onToggleAAClick.bind(this));
            $('.com-chilipeppr-widget-3dviewer-settings-shadows').click(this.onToggleShadowClick.bind(this));
            $('.com-chilipeppr-widget-3dviewer-settings-animation').click(this.onToggleAnimationClick.bind(this));
        },
        
        setCogMenuState: function() {
            var toggleShadowItem = $('.com-chilipeppr-widget-3dviewer-settings-shadows');
            if (this.showShadow && !toggleShadowItem.hasClass('alert-info')) {
                toggleShadowItem.addClass('alert-info');
            } else if (!this.showShadow) {
                toggleShadowItem.removeClass('alert-info');
            }
            
            var toggleAAItem = $('.com-chilipeppr-widget-3dviewer-settings-aa');
            if (!this.disableAA && !toggleAAItem.hasClass('alert-info')) {
                toggleAAItem.addClass('alert-info');
            } else if (this.disableAA) {
                toggleAAItem.removeClass('alert-info');
            }
            
            var enableAnimationItem = $('.com-chilipeppr-widget-3dviewer-settings-animation');
            if (!this.disableAnimation && !enableAnimationItem.hasClass('alert-info')) {
                enableAnimationItem.addClass('alert-info');
            } else if (this.disableAnimation) {
                enableAnimationItem.removeClass('alert-info');
            }
        },
        
        onToggleAAClick: function(evt, param) {
            console.log("got onToggleAAClick. evt:", evt, "param:", param);
            this.disableAA = !this.disableAA; // toggle
            
            localStorage.setItem('disable-aa', (this.disableAA) ? 'true' : 'false');
            console.log ("Set disable-aa in storage:  ", (this.disableAA) ? 'true' : 'false');
            
            this.setCogMenuState();
            
            // you cant dynamically change the state of AA
            //this.renderer.antialias = !this.disableAA;
            
            $('#com-chilipeppr-widget-3dviewer-aa-notice').modal();
        },
        
        onToggleShadowClick: function(evt, param) {
            console.log("got onToggleShadowClick. evt:", evt, "param:", param);
            this.showShadow = !this.showShadow; // toggle
            
            localStorage.setItem('toolhead-shadow', (this.showShadow) ? 'true' : 'false');
            console.log ("Set toolhead-shadow in storage:  ", (this.showShadow) ? 'true' : 'false');
            
            this.renderer.shadowMap.enabled = this.showShadow;
            
            this.setCogMenuState();
            
            this.drawToolhead();
            
            this.animate();
        },
        
        onToggleAnimationClick: function(evt, param) {
            console.log("got onToggleAnimationClick. evt:", evt, "param:", param);
            this.disableAnimation = !this.disableAnimation; // toggle
            
            localStorage.setItem('disable-animation', (this.disableAnimation) ? 'true' : 'false');
            console.log ("Set disable-animation in storage:  ", (this.disableAnimation) ? 'true' : 'false');
            
            this.setCogMenuState();
        },
        
        
        setupGridSizeMenu: function() {
            $('.com-chilipeppr-widget-3dviewer-gridsizing-1x').click(1, this.onGridSizeClick.bind(this));
            $('.com-chilipeppr-widget-3dviewer-gridsizing-2x').click(2, this.onGridSizeClick.bind(this));
            $('.com-chilipeppr-widget-3dviewer-gridsizing-5x').click(5, this.onGridSizeClick.bind(this));
            $('.com-chilipeppr-widget-3dviewer-gridsizing-10x').click(10, this.onGridSizeClick.bind(this));
        },
        onGridSizeClick: function(evt, param) {
            console.log("got onGridSizeClick. evt:", evt, "param:", param);
            
            // remove old css
            $('.com-chilipeppr-widget-3dviewer-gridsizing-' + this.gridSize + 'x').removeClass("alert-info");
            
            var size = evt.data;
            this.gridSize = size;
            // redraw grid
            this.drawGrid();
            
            $('.com-chilipeppr-widget-3dviewer-gridsizing-' + this.gridSize + 'x').addClass("alert-info");
            
            this.animate();
        },
        
        
        setUnits: function(units) {
            if (units == "mm")
                this.isUnitsMm = true;
            else
                this.isUnitsMm = false;
            this.onUnitsChanged();
        },
        requestUnits: function() {
            console.log("requestUnits");
            // we need to publish back the units
            var units = "mm";
            if (!this.isUnitsMm) units = "inch";
            chilipeppr.publish("/" + this.id + "/recvUnits", units);
        },
        onUnitsChanged: function() {
            // we need to publish back the units
            var units = "mm";
            if (!this.isUnitsMm) units = "inch";
            chilipeppr.publish("/" + this.id + "/unitsChanged", units);
            $('.com-chilipeppr-widget-3dviewer-units-indicator').text(units);
        },
        
        request3dObject: function() {
            console.log("request3dObject");
            // we need to publish back the object
            chilipeppr.publish("/" + this.id + "/recv3dObject", this.object, {'scene': this.scene, 'camera': this.camera, 'toolhead': this.toolhead, 'widget': this });
        },
        
        sceneAdd: function(obj) {
            console.log("sceneAdd. obj:", obj);
            
            // TODO: wakeAnimate change
            this.animate();
            this.scene.add(obj);
        },
        sceneRemove: function(obj) {
            console.log("sceneRemove. obj:", obj);
            
            // TODO: wakeAnimate change
            this.animate();
            
            if (obj && 'traverse' in obj) {
                this.scene.remove(obj);
                obj.traverse( function ( child ) {
                    if (child.geometry !== undefined) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                } );
            }
        },
        sceneClear: function() {
            this.stopSampleRun();
            // TODO: wakeAnimate change
            this.animate();
            this.object.children = [];
            this.sceneRemove(this.decorate);
        },
        
        
        btnSetup: function() {
            // attach button bar features
            var that = this;
            this.isLookAtToolHeadMode = true;
            $('.com-chilipeppr-widget-3d-menu-lookattoolhead').click(function () {
                if (that.isLookAtToolHeadMode) {
                    // turn off looking at toolhead
                    that.isLookAtToolHeadMode = false;
                    $('.com-chilipeppr-widget-3d-menu-lookattoolhead').removeClass("active btn-primary");
                } else {
                    // turn on looking at toolhead
                    that.isLookAtToolHeadMode = true;
                    that.lookAtToolHead();
                    $('.com-chilipeppr-widget-3d-menu-lookattoolhead').addClass("active btn-primary");
                }                    
            });
            $('.com-chilipeppr-widget-3d-menu-viewextents').click(function () {
                that.viewExtents()
            });
            $('.com-chilipeppr-widget-3d-menu-samplerun').click(function () {
                that.playSampleRun()
            });
            $('.com-chilipeppr-widget-3d-menu-samplerunstop').click(function () {
                that.stopSampleRun()
            });
            $('.com-chilipeppr-widget-3d-menu-samplerunspeed').click(function () {
                that.speedUp()
            });
            $('.com-chilipeppr-widget-3d-menu-samplerunpause').click(function () {
                that.pauseSampleRun()
            }).prop('disabled', true);
            $('.com-chilipeppr-widget-3d-menu-samplerunstop').prop('disabled', true);
            $('.btn').popover({
                animation: true,
                placement: "auto",
                trigger: "hover"
            });
        },
        forkSetup: function () {
            $('#com-chilipeppr-widget-3dviewer .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 200,
                animation: true
            });
            
            // load the pubsub viewer / fork element which decorates our upper right pulldown
            // menu with the ability to see the pubsubs from this widget and the forking links
            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function () {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function (pubsubviewer) {
                    pubsubviewer.attachTo($('#com-chilipeppr-widget-3dviewer-dropdown'), that);
                });
            });
        },
        onPubSubFileLoaded: function(txt) {
            this.openGCodeFromText(txt);
        },
        error: function (msg) {
            alert(msg);
        },
        loadFile: function (path, callback /* function(contents) */ ) {
            var that = this;

            // rewrite www.chilipeppr.com url's to i2dcui.appspot.com so we support SSL
            path = path.replace(/http\:\/\/www.chilipeppr.com/i, "//i2dcui.appspot.com");
            path = path.replace(/http\:\/\/chilipeppr.com/i, "//i2dcui.appspot.com");
            path = path.replace(/\/\/www.chilipeppr.com/i, "//i2dcui.appspot.com");
            path = path.replace(/\/\/chilipeppr.com/i, "//i2dcui.appspot.com");

            $.get(path, null, callback, 'text')
                .error(function () {
                that.error()
            });
        },
        setDetails: function(txt) {
            $('#com-chilipeppr-widget-3dviewer-renderArea .data-details').text(txt);
        },
        speedUp: function () {
            //var txt = $('.com-chilipeppr-widget-3d-menu-samplerunspeed').text();
            console.log("speedUp. tweenSpeed:", this.tweenSpeed);
            //var s = this.tweenSpeed;
            this.tweenSpeed = this.tweenSpeed * 10;
            if (this.tweenSpeed > 1024) this.tweenSpeed = 1;
            var txt = "x" + this.tweenSpeed;
            $('.com-chilipeppr-widget-3d-menu-samplerunspeed').text(txt);
        },
        openGCodeFromPath: function (path) {
            var that = this;
            
            if (that.object) {
                this.stopSampleRun();
                that.scene.remove(that.object);
            }
            that.loadFile(path, function (gcode) {
                that.object = that.createObjectFromGCode(gcode);
                that.scene.add(that.object);
                that.viewExtents();
                that.drawAxesToolAndExtents();
                that.onUnitsChanged();
                localStorage.setItem('last-loaded', path);
                localStorage.removeItem('last-imported');
            });
            
            // fire off Dat Chu's scene reload signal
            that.onSignalSceneReloaded();
        },
        openGCodeFromText: function (gcode) {
            console.log("openGcodeFromText");

            if (this.object) {
                this.stopSampleRun();
                this.scene.remove(this.object);
            }
            
            this.object = this.createObjectFromGCode(gcode);
            console.log("done creating object:", this.object);
            this.scene.add(this.object);
            
            this.viewExtents();
            this.drawAxesToolAndExtents();
            this.onUnitsChanged();
            this.setDetails(this.parsedLines.length + " GCode Lines");
            
            // TODO: wakeAnimate change
            this.animate();
            
            // TODO: maybe we remove this logic all-together
            // we can get a QuotaExceededError here, so catch it
            try {
                // remove old 1st to perhaps make more room for quota check
                localStorage.removeItem('last-imported');
                // now set
                localStorage.setItem('last-imported', gcode);
            } catch(e) {
                if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name == "QuotaExceededError" || e.code == 22 || e.name == "NS_ERROR_DOM_QUOTA_REACHED" || e.code == 1014) {
                    console.error("3D Viewer Widget. out of local storage space, but letting user proceed. err:", e);
                    $('#com-chilipeppr-widget-3dviewer-outofspace').modal();
                } else {
                    console.error("3D Viewer Widget. got err with localStorage:", e);
                }
            }
            localStorage.removeItem('last-loaded');
            
            // fire off Dat Chu's scene reload signal
            this.onSignalSceneReloaded();
        },
        lookAtCenter: function () {
            // this method makes the trackball controls look at center of gcode object
            this.controls.target.x = this.sceneCenter.x;
            this.controls.target.y = this.sceneCenter.y;
            this.controls.target.z = this.sceneCenter.z;
        },

        lookAtToolHead: function () {
            // this method makes the trackball controls look at the tool head
            if (this.isLookAtToolHeadMode) {
                this.controls.target.x = this.toolhead.position.x;
                this.controls.target.y = this.toolhead.position.y;
                this.controls.target.z = this.toolhead.position.z;
            }
        },
        toCameraCoords: function (position) {
            return this.camera.matrixWorldInverse.multiplyVector3(position.clone());
        },
        scaleInView: function () {
            // NOT WORKING YET
            var tmp_fov = 0.0;

            for (var i = 0; i < 8; i++) {
                proj2d = this.toCameraCoords(boundbox.geometry.vertices[i]);

                angle = 114.59 * Math.max( // 2 * (Pi / 180)
                Math.abs(Math.atan(proj2d.x / proj2d.z) / this.camera.aspect),
                Math.abs(Math.atan(proj2d.y / proj2d.z)));
                tmp_fov = Math.max(tmp_fov, angle);
            }

            this.camera.fov = tmp_fov + 5; // An extra 5 degrees keeps all lines visible
            this.camera.updateProjectionMatrix();
        },
        viewExtents: function () {
            console.log("controls:", this.controls);
            
            // TODO: wakeAnimate change
            this.moveAnimate = true;
            this.animate();
            this.moveAnimate = false;
            
            // lets override the bounding box with a newly
            // generated one
            // get its bounding box
            var helper = new THREE.BoxHelper(this.object, 0xff0000);
                        
            var box = new THREE.Box3();
            box.setFromObject(helper);
            
            this.bboxHelper = helper;
            
            // If you want a visible bounding box
            console.log("helper bbox:", box);
            
            var minx = box.min.x;
            var miny = box.min.y;
            var maxx = box.max.x;
            var maxy = box.max.y;
            var minz = box.min.z;
            var maxz = box.max.z;
            
            var center = this.sceneCenter;
            center.x = minx + ((maxx - minx) / 2);
            center.y = miny + ((maxy - miny) / 2);
            center.z = minz + ((maxz - minz) / 2);
            
            this.controls.reset();
            
            var lenx = maxx - minx;
            var leny = maxy - miny;
            var lenz = maxz - minz;
            console.log("lenx:", lenx, "leny:", leny, "lenz:", lenz);
            
            var maxBeforeWarnX = 50;
            var maxBeforeWarnY = 50;
            var maxBeforeWarnZ = 50;
            
            if (lenx > maxBeforeWarnX || leny > maxBeforeWarnY || lenz > maxBeforeWarnZ) {
                //alert ("too big!");
                //chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "GCode Size Warning", "This GCode looks very large. Are you sure the units are correct?", 6 * 1000);
            }
            
            
            var maxlen = Math.max(lenx, leny, lenz);
            var dist = 2 * maxlen;
            
            // center camera on gcode objects center pos, but twice the maxlen
            this.controls.object.position.x = center.x;
            this.controls.object.position.y = center.y;
            this.controls.object.position.z = center.z + dist;
            this.controls.target.x = center.x;
            this.controls.target.y = center.y;
            this.controls.target.z = center.z;
            console.log("maxlen:", maxlen, "dist:", dist);
            var fov = 2.2 * Math.atan(maxlen / (2 * dist)) * (180 / Math.PI);
            console.log("new fov:", fov, " old fov:", this.controls.object.fov);
            if (isNaN(fov)) {
                console.log("giving up on viewing extents because fov could not be calculated");
                return;
            }
            this.controls.object.fov = fov;
            
            var L = dist;
            var camera = this.controls.object;
            var vector = controls.target.clone();
            var l = (new THREE.Vector3()).subVectors(camera.position, vector).length();
            var up = camera.up.clone();
            var quaternion = new THREE.Quaternion();
            
            // Zoom correction
            // TODO: explore why this is setting setFromAxisAngle 3 times
            camera.translateZ(L - l);
            console.log("up:", up);
            up.y = 1; up.x = 0; up.z = 0;
            quaternion.setFromAxisAngle(up, 0.5);

            up.y = 0; up.x = 1; up.z = 0;
            quaternion.setFromAxisAngle(up, 0.5);
            camera.position.applyQuaternion(quaternion);
            
            up.y = 0; up.x = 0; up.z = 1;
            quaternion.setFromAxisAngle(up, 0.5);
                
            camera.lookAt(vector);
                        
            this.controls.object.updateProjectionMatrix();
        },
        stopSampleRun: function (evt) {
            console.log("stopSampleRun. tween:", this.tween);
            this.tweenAnimate = false;
            
            this.tweenIsPlaying = false;

            if (this.tweenHighlight) this.scene.remove(this.tweenHighlight);
            if (this.tween) this.tween.stop();

            $('.com-chilipeppr-widget-3d-menu-samplerun').prop('disabled', false);
            $('.com-chilipeppr-widget-3d-menu-samplerunstop').prop('disabled', true);
            $('.com-chilipeppr-widget-3d-menu-samplerunstop').popover('hide');
            
            // TODO: animAllowSleep
            //this.animAllowSleep();
        },
        pauseSampleRun: function () {
            console.log("pauseSampleRun");
            if (this.tweenPaused) {
                console.log("unpausing tween");
                
                // TODO: fix
                //this.animNoSleep();
                this.tweenAnimate = true;
                
                this.tweenIsPlaying = true;
                this.tweenPaused = false;
                this.playNextTween();
                
                this.animate();
            } else {
                console.log("pausing tween on next playNextTween()");
                this.tweenAnimate = false;
                
                this.tweenIsPlaying = false;
                this.tweenPaused = true;
                
                // TODO: animAllowSleep
                //this.animAllowSleep();
                this.animate();
            }
        },
        gotoXyz: function(data) {
            // we are sent this command by the CNC controller generic interface
            console.log("gotoXyz. data:", data);
            
            // TODO: fix
            //this.animNoSleep();
            this.tweenAnimate = false;
            
            this.tweenIsPlaying = false;
            this.tweenPaused = true;
            
            if ('x' in data && data.x != null) this.toolhead.position.x = data.x;
            if ('y' in data && data.y != null) this.toolhead.position.y = data.y;
            if ('z' in data && data.z != null) this.toolhead.position.z = data.z;
            
            if (this.showShadow) {
                this.toolhead.children[0].target.position.set(this.toolhead.position.x, this.toolhead.position.y, this.toolhead.position.z);
                this.toolhead.children[1].target.position.set(this.toolhead.position.x, this.toolhead.position.y, this.toolhead.position.z);
            }
            
            this.lookAtToolHead();
            
            // see if jogging, if so rework the jog tool
            // double check that our jog 3d object is defined
            // cuz on early load we can get here prior to the
            // jog cylinder and other objects being defined
            if (this.isJogSelect && this.jogArrowCyl) {
                if ('z' in data && data.z != null) {
                    console.log("adjusting jog tool:", this.jogArrow);
                    
                    var cyl = this.jogArrowCyl; //.children[0];
                    var line = this.jogArrowLine; //.children[2];
                    var shadow = this.jogArrowShadow; //.children[3];
                    var posZ = data.z * 3; // acct for scale
                    cyl.position.setZ(posZ + 20);
                    
                    console.log("line:", line.geometry.vertices);
                    line.geometry.vertices[1].z = posZ; // 2nd top vertex
                    line.geometry.verticesNeedUpdate = true;
                    shadow.position.setX(posZ * -1); // make x be z offset
                }
            }
            // TODO: animAllowSleep
            //this.animAllowSleep();
        },
        gotoLine: function(data) {
            // this method is sort of like playNextTween, but we are jumping to a specific
            // line based on the gcode sender
            console.log("got gotoLine. data:", data);
            
            // TODO: fix
            //this.animNoSleep();
            this.tweenAnimate = true;
            
            this.tweenIsPlaying = false;
            this.tweenPaused = true;
            
            var lines = this.parsedLines;
            console.log("parsedLines:", lines[data.line]);
            var curLine = lines[data.line];
            var curPt = curLine.p2;
            
            console.log("p2 for toolhead move. curPt:", curPt);
            this.toolhead.position.x = curPt.x;
            this.toolhead.position.y = curPt.y;
            this.toolhead.position.z = curPt.z;
            
            if (this.showShadow) {
                this.toolhead.children[0].target.position.set(this.toolhead.position.x, this.toolhead.position.y, this.toolhead.position.z);
                this.toolhead.children[1].target.position.set(this.toolhead.position.x, this.toolhead.position.y, this.toolhead.position.z);
            }
            
            this.lookAtToolHead();
            
            // TODO: animAllowSleep
            //this.animAllowSleep();
            
            /* GOOD STUFF BUT IF DON'T WANT ANIM*/
            if (this.tweenHighlight) this.scene.remove(this.tweenHighlight);
            if (this.tween) this.tween.stop();
            
            if (data.anim && data.anim == "anim") {
                console.log("being asking to animate gotoline");
                // TODO: fix
                //this.animNoSleep();
                this.tweenAnimate = true;
                
                this.tweenPaused = false;
                this.tweenIsPlaying = true;
                this.tweenIndex = data.line;
                
                this.playNextTween(true);
            }
            
            this.animate();
        },
        playNextTween: function (isGotoLine) {

            if (this.tweenPaused) return;

            var that = this;
            
            var lines = this.parsedLines;
            
            if (this.tweenIndex + 1 > lines.length - 1) {
                // done tweening
                console.log("Done with tween");
                this.stopSampleRun();
                return;
            }

            var lineMat = new THREE.LineBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 1,
            });

            // find next correct tween, i.e. ignore fake commands
            var isLooking = true;
            var indxStart = this.tweenIndex + 1;
            
            while(isLooking) {
                if (indxStart > lines.length - 1) {
                    console.log("we are out of lines to look at");
                    that.stopSampleRun();
                    return;
                }
                if (lines[indxStart].args.isFake) {
                    // this is fake, skip it
                    //console.log("found fake line at indx:", indxStart);
                } else {
                    // we found a good one. use it
                    //console.log("found one at indx:", indxStart);
                    isLooking = false;
                    break;
                }
                indxStart++;
            }
            
            var ll;
            if (lines[this.tweenIndex].p2) ll = lines[this.tweenIndex].p2;
            else ll = {x:0,y:0,z:0};
            
            console.log("start line:", lines[this.tweenIndex], "ll:", ll);
            
            this.tweenIndex = indxStart;
            var cl = lines[this.tweenIndex].p2;
            console.log("end line:", lines[this.tweenIndex], " el:", cl);
            
            
            var curTween = new TWEEN.Tween({
                x: ll.x,
                y: ll.y,
                z: ll.z
            })
                .to({
                x: cl.x,
                y: cl.y,
                z: cl.z
            }, 1000 / that.tweenSpeed)
            .onStart(function () {
                that.tween = curTween;
                //console.log("onStart");
                // create a new line to show path
                
                var lineGeo = new THREE.Geometry();
                lineGeo.vertices.push(new THREE.Vector3(ll.x, ll.y, ll.z), new THREE.Vector3(cl.x, cl.y, cl.z));
                var line = new THREE.Line(lineGeo, lineMat);
                line.type = THREE.Lines;
                
                that.tweenHighlight = line;
                that.scene.add(line);

            })
            .onComplete(function () {
                //console.log("onComplete");
                that.scene.remove(that.tweenHighlight);
                //setTimeout(function() {that.playNextTween();}, 0);
                if (isGotoLine) {
                    console.log("got onComplete for tween and since isGotoLine mode we are stopping");
                    that.stopSampleRun();
                } else {
                    that.playNextTween();
                }
            })
            .onUpdate(function () {
                that.toolhead.position.x = this.x;
                that.toolhead.position.y = this.y;
                that.toolhead.position.z = this.z;

                if (this.showShadow) {
                    that.toolhead.children[0].target.position.set(this.x, this.y, that.toolhead.position.z);
                    that.toolhead.children[1].target.position.set(this.x, this.y, that.toolhead.position.z);
                }
                
                that.lookAtToolHead();
            });
            
            
            
            this.tween = curTween;
            this.tween.start();
        },

        playSampleRun: function (evt) {
            console.log("controls:", this.controls);

            // TODO: fix
            //this.animNoSleep();
            $('.com-chilipeppr-widget-3d-menu-samplerun').prop('disabled', true);
            $('.com-chilipeppr-widget-3d-menu-samplerun').popover('hide');
            $('.com-chilipeppr-widget-3d-menu-samplerunstop').prop('disabled', false);
            $('.com-chilipeppr-widget-3d-menu-samplerunpause').prop('disabled', false);

            this.tweenAnimate = true;
            
            this.tweenPaused = false;
            this.tweenIsPlaying = true;
            this.tweenIndex = 0;

            var that = this;
            console.log("playSampleRun");

            // cleanup previous run
            TWEEN.removeAll();

            // we will tween all gcode locs in order
            var tween = new TWEEN.Tween({
                x: 0,
                y: 0,
                z: 0
            })
                .to({
                x: 0,
                y: 0,
                z: 0
            }, 20)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(function () {
                that.playNextTween();
            })
            .onUpdate(function () {
                that.toolhead.position.x = this.x;
                that.toolhead.position.y = this.y;
                that.toolhead.position.z = this.z;
                
                // update where shadow casting light is looking
                if (this.showShadow) {
                    that.toolhead.children[0].target.position.set(this.x, this.y, that.toolhead.position.z);
                    that.toolhead.children[1].target.position.set(this.x, this.y, that.toolhead.position.z);
                }
                
            });

            this.tween = tween;
            this.tweenIndex = 0;
            
            this.tween.start();
            
            this.animate();
        },
        

        downloadFont: function() {
            console.log('downloading font');
            
            var that = this;
            $.ajax({
                url: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json',
                async: false,
                dataType: 'json',
                success: function(response) {
                    that.textFont = new THREE.Font(response);
                    if (that.textFont) {
                        console.log('font download success');
                    }
                }
            });
        },
        makeText: function(vals) {
            if (!this.textFont) {
                console.log('no font defined');
                return;
            }
            
            var shapes, geom, mat, mesh;
            console.log('about to make text: ', vals.text);
            
            var textGeometry = new THREE.TextGeometry(vals.text, {
                font: this.textFont,
                size: vals.size ? vals.size : 10,
                height: 0.1,
                curveSegments: 12,
            });
            
            textMaterial = new THREE.MeshBasicMaterial({
                color: vals.color,
                transparent: true,
                opacity: vals.opacity ? vals.opacity : 0.5,
            });
            
            mesh = new THREE.Mesh(textGeometry, textMaterial);
        
            mesh.position.x = vals.x;
            mesh.position.y = vals.y;
            mesh.position.z = vals.z;
        
            mesh.castShadow = false;
            
            return mesh;
        },

        decorateExtents: function() {
            // remove grid if drawn previously
            if (this.decorate != null) {
                console.log("there was a previous extent decoration. remove it. grid:", this.decorate);
                this.sceneRemove(this.decorate);
            } else {
                console.log("no previous decorate extents.");
            }
            
            if (!this.textFont) {
                console.log('unable to render extents without a font');
                return;
            }
            
            if (!this.object) {
                return;
            }
            
            // get its bounding box
            console.log("about to do THREE.BoxHelper on this.object:", this.object);
            var helper = new THREE.BoxHelper(this.object, 0xff0000);
            
            var box = new THREE.Box3();            
            box.setFromObject(helper);
            
            //helper.update();
            this.bboxHelper = helper;
            
            console.log("helper bbox:", box);
            
            var color = '#0d0d0d';            
            var material = new THREE.LineDashedMaterial({ 
                vertexColors: false, 
                color: color,
                dashSize: this.getUnitVal(1), gapSize: this.getUnitVal(1), linewidth: this.lineWidth,
                transparent: true,
                opacity: 0.3,
            });

            // Create X axis extents sprite
            var z = 0;
            var offsetFromY = this.getUnitVal(-4); // this means we'll be below the object by this padding
            var lenOfLine = this.getUnitVal(5);
            
            var minx = box.min.x;
            var miny = box.min.y;
            var maxx = box.max.x;
            var maxy = box.max.y;
            var minz = box.min.z;
            var maxz = box.max.z;
            
            var lineGeo = new THREE.Geometry();
            lineGeo.vertices.push(
                new THREE.Vector3(minx, miny+offsetFromY, z), 
                new THREE.Vector3(minx, miny+offsetFromY-lenOfLine, z),
                new THREE.Vector3(minx, miny+offsetFromY-lenOfLine, z),
                new THREE.Vector3(maxx, miny+offsetFromY-lenOfLine, z),
                new THREE.Vector3(maxx, miny+offsetFromY-lenOfLine, z),
                new THREE.Vector3(maxx, miny+offsetFromY, z)
                
            );
            
            lineGeo.computeLineDistances();
            var line = new THREE.LineSegments(lineGeo, material);
            line.type = THREE.Lines;
            
            // Draw text label of length
            var txt = "X " + (maxx - minx).toFixed(2);
            txt += (this.isUnitsMm) ? " mm" : " in";
            var txtX = this.makeText({
                x: minx + this.getUnitVal(1),
                y: miny + offsetFromY - lenOfLine - this.getUnitVal(3),
                z: z,
                text: txt,
                color: color,
                opacity: 0.3,
                size: this.getUnitVal(2)
            });
            
            // Create Y axis extents sprite
            var offsetFromX = this.getUnitVal(-4); // this means we'll be below the object by this padding
            
            var lineGeo2 = new THREE.Geometry();
            lineGeo2.vertices.push(
                new THREE.Vector3(minx + offsetFromX, miny, z), 
                new THREE.Vector3(minx + offsetFromX - lenOfLine, miny, z),
                new THREE.Vector3(minx + offsetFromX - lenOfLine, miny, z),
                new THREE.Vector3(minx + offsetFromX - lenOfLine, maxy, z),
                new THREE.Vector3(minx + offsetFromX - lenOfLine, maxy, z),
                new THREE.Vector3(minx + offsetFromX, maxy, z)
            );
            
            lineGeo2.computeLineDistances();
            var line2 = new THREE.LineSegments(lineGeo2, material);
            line2.type = THREE.Lines;
            
            // Draw text label of length
            var txt = "Y " + (maxy - miny).toFixed(2);
            txt += (this.isUnitsMm) ? " mm" : " in";
            var txtY = this.makeText({
                x: minx + offsetFromX - lenOfLine,
                y: miny - this.getUnitVal(3),
                z: z,
                text: txt,
                color: color,
                opacity: 0.3,
                size: this.getUnitVal(2)
            });

            var zlineGeo = new THREE.Geometry();
            var lenEndCap = this.getUnitVal(2);
            zlineGeo.vertices.push(
                new THREE.Vector3(maxx, miny, minz), 
                new THREE.Vector3(maxx + lenOfLine, miny, minz), 
                new THREE.Vector3(maxx + lenOfLine, miny, minz), 
                new THREE.Vector3(maxx + lenOfLine, miny, maxz),
                new THREE.Vector3(maxx + lenOfLine, miny, maxz),
                new THREE.Vector3(maxx, miny, maxz) 
            );
            
            zlineGeo.computeLineDistances();
            var zline = new THREE.LineSegments(zlineGeo, material);
            zline.type = THREE.Lines;
            
            // Draw text label of z height
            var txt = "Z " + (maxz - minz).toFixed(2);
            txt += (this.isUnitsMm) ? " mm" : " in";
            var txtZ = this.makeText({
                x: maxx + offsetFromX + lenOfLine,
                y: miny - this.getUnitVal(3),
                z: z,
                text: txt,
                color: color,
                opacity: 0.3,
                size: this.getUnitVal(2)
            });
            txtZ.rotateX(Math.PI / 2);
            var v = txtZ.position;
            txtZ.position.set(v.x + this.getUnitVal(5), v.y + this.getUnitVal(3), v.z);
            
            // draw lines on X axis to represent width
            // create group to put everything into
            this.decorate = new THREE.Object3D();
            this.decorate.add(line);
            this.decorate.add(txtX);
            this.decorate.add(line2);
            this.decorate.add(txtY);
            this.decorate.add(zline);
            this.decorate.add(txtZ);
            
            // Add estimated time and distance
            var ud = this.parsedLines;
            var udLastLine = ud[ud.length-1].p2;
            
            // get pretty print of time
            var ret = this.convertMinsToPrettyDuration(udLastLine.timeMinsSum);
            
            
            var txt = "Estimated Time: " + ret + ","
            + " Total Distance: " + (udLastLine.distSum).toFixed(2);
            txt = (this.isUnitsMm) ? txt + " mm" : txt + " in";
            
            var txtTimeDist = this.makeText({
                x: minx + this.getUnitVal(1),
                y: miny + offsetFromY - lenOfLine - this.getUnitVal(6),
                z: z,
                text: txt,
                color: color,
                opacity: 0.3,
                size: this.getUnitVal(2)
            });
            
            this.decorate.add(txtTimeDist);
            
            this.sceneAdd(this.decorate);
            console.log("just added decoration:", this.decorate);

        },
        
        convertMinsToPrettyDuration: function(mins) {
            // Minutes and seconds
            var time = mins * 60;
            //var mins = ~~(time / 60);
            //var secs = time % 60;
            
            // Hours, minutes and seconds
            var hrs = ~~(time / 3600);
            var mins = ~~((time % 3600) / 60);
            var secs = time % 60;
            
            // Output like "1:01" or "4:03:59" or "123:03:59"
            ret = "";
            
            if (hrs > 0)
                ret += "" + hrs + "h " + (mins < 10 ? "0" : "");
            
            ret += "" + mins + "m " + (secs < 10 ? "0" : "");
            ret += "" + secs.toFixed(0) + "s";
            return ret;
        },
        
        // TODO: review makeSprite code
        makeSprite: function (scene, rendererType, vals) {
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                metrics = null,
                textHeight = 100,
                textWidth = 0,
                actualFontSize = this.getUnitVal(10);
                
            var txt = vals.text;
            if (vals.size) actualFontSize = vals.size;

            context.font = "normal " + textHeight + "px Arial";
            metrics = context.measureText(txt);
            var textWidth = metrics.width;

            canvas.width = textWidth;
            canvas.height = textHeight;
            context.font = "normal " + textHeight + "px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = vals.color;

            context.fillText(txt, textWidth / 2, textHeight / 2);

            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;

            var material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.6
            });
            
            material.transparent = true;
            
            
            //var textObject = new THREE.Sprite(material);
            var textObject = new THREE.Object3D();
            textObject.position.x = vals.x;
            textObject.position.y = vals.y;
            textObject.position.z = vals.z;
            var sprite = new THREE.Sprite(material);
            textObject.textHeight = actualFontSize;
            textObject.textWidth = (textWidth / textHeight) * textObject.textHeight;
            if (rendererType == "2d") {
                sprite.scale.set(textObject.textWidth / textWidth, textObject.textHeight / textHeight, 1);
            } else {
                sprite.scale.set(textWidth / textHeight * actualFontSize, actualFontSize, 1);
            }

            textObject.add(sprite);

            return textObject;
        },

        getInchesFromMm: function(mm) {
            return mm * 0.0393701;
        },
        getUnitVal: function(val) {
            // if drawing untis is mm just return cuz default
            if (this.isUnitsMm) return val;
            // if drawing is in inches convert
            return this.getInchesFromMm(val);
        },
        
        drawAxesToolAndExtents: function() {
            // these are drawn after the gcode is rendered now
            // so we can see if in inch or mm mode
            // these items scale based on that mode
            this.drawToolhead();
            this.drawGrid();
            this.drawExtentsLabels();
            this.drawAxes();
        },

        drawToolhead: function() {
            console.group("drawToolhead");
            
            // remove grid if drawn previously
            if (this.toolhead != null) {
                console.log("there was a previous toolhead. remove it. toolhead:", this.toolhead, "shadowplane:", this.shadowplane);
                if (this.shadowplane != null) {
                    console.log("removing shadowplane and setting null");
                    this.sceneRemove(this.shadowplane);
                    this.shadowplane = null;
                }
                this.sceneRemove(this.toolhead);
            } else {
                console.log("no previous toolhead or shadowplane.");
            }
            
            var scale = this.getUnitVal(1);
            
            // TOOLHEAD WITH SHADOW
            var toolheadgrp = new THREE.Object3D();
            toolheadgrp.scale.set(scale, scale, scale);

            // ToolHead Cylinder
            // API: THREE.CylinderGeometry(bottomRadius, topRadius, height, segmentsRadius, segmentsHeight)
            var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0, 5, 40, 15, 1, false), new THREE.MeshNormalMaterial());
            cylinder.overdraw = true;
            cylinder.rotation.x = -90 * Math.PI / 180;
            cylinder.position.z = 20;
            cylinder.material.opacity = 0.3;
            cylinder.material.transparent = true;
            cylinder.castShadow = true;
            
            console.log("toolhead cone:", cylinder);
            toolheadgrp.add(cylinder);
            
            if (this.showShadow) {
                var light = new THREE.DirectionalLight(0xffffff);
                light.position.set(0, 100, 100);
                
                light.shadow.camera.near = 0;
                light.shadow.camera.far = this.getUnitVal(1000);
                light.shadow.camera.left = this.getUnitVal(-100);
                light.shadow.camera.right = this.getUnitVal(100);
                light.shadow.camera.top = this.getUnitVal(100);
                light.shadow.camera.bottom = this.getUnitVal(-100);
                
                light.castShadow = true;
                
                light.shadow.mapSize.width = 2048;
                light.shadow.mapSize.height = 2048;
                
                toolheadgrp.add(light);
                
                
                // shadow plane
                var planeGeometry = new THREE.PlaneGeometry(10000, 10000);
                
                var planeMaterial = new THREE.ShadowMaterial();
                planeMaterial.opacity = 0.1;
                planeMaterial.transparent = true;
                planeMaterial.depthWrite = false;
                planeMaterial.depthTest = false;
                
                var plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.scale.set(scale, scale, scale);
                
                plane.position.z = 0;
                
                plane.castShadow = false;
                plane.receiveShadow = true;
                
                this.shadowplane = plane;
                this.sceneAdd(this.shadowplane);
            }
            
            
            this.toolhead = toolheadgrp;
            this.sceneAdd(this.toolhead);
            
            console.groupEnd();
            
        },

        gridTurnOff: function() {
            if (this.grid != null) {
                console.log("there was a previous grid. remove it. grid:", this.grid);
                this.sceneRemove(this.grid);
            } else {
                console.log("no previous grid.");
            }
        },
        gridTurnOn: function() {
            if (this.grid != null) {
                console.log("there was a previous grid. so ignoring request to turn on. grid:", this.grid);
            } else {
                console.log("no previous grid. so drawing.");
                this.drawGrid();
            }
        },
        drawGrid: function() {
            // remove grid if drawn previously
            if (this.grid != null) {
                console.log("there was a previous grid. remove it. grid:", this.grid);
                this.sceneRemove(this.grid);
            } else {
                console.log("no previous grid.");
            }

            // will get mm or inches for grid
            var widthHeightOfGrid; //= this.getUnitVal(200);
            var subSectionsOfGrid; //= this.getUnitVal(10);
            
            if (this.isUnitsMm) {
                widthHeightOfGrid = 200; // 200 mm grid should be reasonable
                subSectionsOfGrid = 10; // 10mm (1 cm) is good for mm work
            } else {
                widthHeightOfGrid = 20; // 20 inches is good
                subSectionsOfGrid = 1; // 1 inch grid is nice
            }
            
            // see if user wants to size up grid. default is size 1
            // so this won't modify size based on default
            widthHeightOfGrid = widthHeightOfGrid * this.gridSize;
            
            // draw grid
            var helper = new THREE.GridHelper(widthHeightOfGrid, subSectionsOfGrid, 0x0000ff, 0x808080);
            // helper.setColors(0x0000ff, 0x808080);
            helper.position.y = 0;
            helper.position.x = 0;
            helper.position.z = 0;
            helper.rotation.x = 90 * Math.PI / 180;
            helper.material.opacity = 0.15;
            helper.material.transparent = true;
            helper.receiveShadow = false;
            
            console.log("helper grid:", helper);
            this.grid = helper;
            this.sceneAdd(this.grid);
        },
        drawExtentsLabels: function() {
            this.decorateExtents();
        },

        drawAxes: function() {
            // remove axes if they were drawn previously
            if (this.axes != null) {
                console.log("there was a previous axes. remove it. axes:", this.axes);
                this.sceneRemove(this.axes);
            } else {
                console.log("no previous axes to remove. cool.");
            }
            
            // axes
            var axesgrp = new THREE.Object3D();
            
            axes = new THREE.AxisHelper(this.getUnitVal(100));
            axes.material.transparent = true;
            axes.material.opacity = 0.8;
            axes.material.depthWrite = false;
            axes.position.set(0,0,-0.0001);
            axesgrp.add(axes);

            // add axes labels
            var xlbl = this.makeSprite(this.scene, "webgl", {
                x: this.getUnitVal(110),
                y: 0,
                z: 0,
                text: "X",
                color: "#ff0000"
            });
            
            var ylbl = this.makeSprite(this.scene, "webgl", {
                x: 0,
                y: this.getUnitVal(110),
                z: 0,
                text: "Y",
                color: "#00ff00"
            });
            
            var zlbl = this.makeSprite(this.scene, "webgl", {
                x: 0,
                y: 0,
                z: this.getUnitVal(110),
                text: "Z",
                color: "#0000ff"
            });
            
            axesgrp.add(xlbl);
            axesgrp.add(ylbl);
            axesgrp.add(zlbl);
            
            this.axes = axesgrp;
            this.sceneAdd(this.axes);
        },

        createScene: function (element) {
            console.log("inside createScene: element:", element);

            // store element on this object
            this.element = element;
            
            // Scene
            var scene = new THREE.Scene();
            this.scene = scene;

            // Lights...
            var ctr = 0;
            [
                [0, 0, 1, 0xFFFFCC],
                [0, 1, 0, 0xFFCCFF],
                [1, 0, 0, 0xCCFFFF],
                [0, 0, -1, 0xCCCCFF],
                [0, -1, 0, 0xCCFFCC],
                [-1, 0, 0, 0xFFCCCC]
            ].forEach(function (position) {
                var light = new THREE.DirectionalLight(position[3]);
                light.position.set(position[0], position[1], position[2]).normalize();
                scene.add(light);
                ctr++;
            });

            // Camera...
            // If you make the near and far too much you get
            // a fail on the intersectObjects()
            var fov = 65;
            var aspect = element.width() / element.height();
            var near = 1; //01, // 1e-6, //
            var far = 1000;
            var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
            
            camera.rotationAutoUpdate = true;
            camera.position.x = 10;
            camera.position.y = -100;
            camera.position.z = 200;
            this.camera = camera;
            
            scene.add(camera);

            // Controls
            controls = new THREE.TrackballControls(camera, element[0]);            
            controls.noPan = false;
            controls.dynamicDampingFactor = 0.99; //0.15;
            controls.rotateSpeed = 2.0;
            
            this.controls = controls; // set property for later use
            
            console.log("controls:", controls);
            
            
            document.addEventListener( 'mousemove', controls.update.bind( controls ), false );
            document.addEventListener( 'touchmove', controls.update.bind( controls ), false );
            
            // Renderer
            // TODO: review renderer setup, see if we can open up any other options or optimizations
            var renderer;
            var webgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();

            if (!webgl) {
                console.error('No WebGL Support found! CRITICAL ERROR!');
                
                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "No WebGL Found!", "This device/browser does not support WebGL or WebGL has crashed. Chilipeppr needs WebGL to render the 3D View.", 10 * 1000);
               
                $('#' + this.id + ' .youhavenowebgl').removeClass("hidden");
                return;
            }
            
            console.log('WebGL Support found!  Success: CP will work optimally on this device!');

            renderer = new THREE.WebGLRenderer({
                antialias: !this.disableAA,
                preserveDrawingBuffer: false,
                alpha: true,
                logarithmicDepthBuffer: false
            });
            
            // base properties
            renderer.setClearColor(this.colorBackground, 1);
            renderer.setSize(element.width(), element.height());
            renderer.setPixelRatio( window.devicePixelRatio );
            
            // cast shadows
            renderer.shadowMap.enabled = this.showShadow;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            this.renderer = renderer;
            element.append(renderer.domElement);


            // Action!
            var mouseEvtContainer = $('#com-chilipeppr-widget-3dviewer-renderArea');
            console.log(mouseEvtContainer);
            
            // TODO: wakeAnimate change
            /*
            
            
            console.log("this wantAnimate:", this);
            
            this.wakeAnimate();
            */
            
            var that = this;
            
            
            controls.addEventListener('start', function() {
                that.moveAnimate = true;
                that.animate();
            });
            
            controls.addEventListener('end', function() {
                that.animate();
                that.moveAnimate = false;
            });
            
            // our very first animate call
            this.animate();
            
            // Fix coordinates up if window is resized.
            $(window).on('resize', function () {
                // TODO: explore a way to correctly callback, rather than duplicate code.
                that.renderer.setSize(element.width(), element.height());
            
                that.camera.aspect = element.width() / element.height();
                that.camera.updateProjectionMatrix();
            
                that.controls.screen.width = that.domElement.width();
                that.controls.screen.height = that.domElement.height();
                
                // TODO: wakeAnimate change
                that.animate();
            });

            return scene;
        },
        resize: function() {
            this.renderer.setSize(this.element.width(), this.element.height());
            
            this.camera.aspect = this.element.width() / this.element.height();
            this.camera.updateProjectionMatrix();
            
            this.controls.screen.width = this.domElement.width();
            this.controls.screen.height = this.domElement.height();
            
            // TODO: wakeAnimate change
            this.animate();
        },
        
        animate: function() {
            var that = this;
            
            // TODO: Implement dynamic scaling for animationLatencyDelay based on assessed load 
            
            if (this.fpsCalculationTimer == null) {
                // calculate the actual fps every 2 seconds
                this.fpsCalculationTimer = setInterval(function() {
                    var fps = (that.renderFrameCount / 2);
                    that.renderFrameCount = 0;
                    $('.frames-per-sec').html(fps + "&nbsp;fps");
                    
                    // scale our animation delay based on actual fps achieved
                    if (fps > 30) {
                        this.animationLatencyDelay = this.animationLatencyDelayDefault;
                    } else if (fps > 20) {
                        this.animationLatencyDelay = 70;
                    } else if (fps > 10) {
                        this.animationLatencyDelay = 150;
                    } else {
                        this.animationLatencyDelay = 300;
                    }
                }, 2000);
            }
            
            if ((this.moveAnimate || this.tweenAnimate || this.inspectAnimate) && this.animationLatencyTimer == null) {
                var animationDelay = (!this.moveAnimate && this.disableAnimation) ? 2000 : this.animationLatencyDelay;
                
                this.animationLatencyTimer = setTimeout(function() {
                    TWEEN.update();
                    requestAnimationFrame(that.animate.bind(that));
                    that.animationLatencyTimer = null;
                }, animationDelay);
            }
        
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this.renderFrameCount++;
        },
        
        
        /**
         * Parses a string of gcode instructions, and invokes handlers for
         * each type of command.
         *
         * Special handler:
         *   'default': Called if no other handler matches.
         */
        GCodeParser: function (handlers) {
            this.handlers = handlers || {};
            
            this.lastArgs = {cmd: null};
            this.lastFeedrate = null;
            this.isUnitsMm = true;
            
            this.parseLine = function (text, info) {
                var origtext = text;
                // remove line numbers if exist
                if (text.match(/^N/i)) {
                    // yes, there's a line num
                    text = text.replace(/^N\d+\s*/ig, "");
                }
                
                // collapse leading zero g cmds to no leading zero
                text = text.replace(/G00/i, 'G0');
                text = text.replace(/G0(\d)/i, 'G$1');
                // add spaces before g cmds and xyzabcijkf params
                text = text.replace(/([gmtxyzabcijkfst])/ig, " $1");
                // remove spaces after xyzabcijkf params because a number should be directly after them
                text = text.replace(/([xyzabcijkfst])\s+/ig, "$1");
                // remove front and trailing space
                text = text.trim();
                
                // see if comment
                var isComment = false;
                if (text.match(/^(;|\(|<)/)) {
                    text = origtext;
                    isComment = true;
                } else {
                    // make sure to remove inline comments
                    text = text.replace(/\(.*?\)/g, "");
                }
                
                if (text && !isComment) {
                    // strip off end of line comment
                    text = text.replace(/(;|\().*$/, ""); // ; or () trailing
                    //text = text.replace(/\(.*$/, ""); // () trailing
                    
                    var tokens = text.split(/\s+/);
                    //console.log("tokens:", tokens);
                    if (tokens) {
                        var cmd = tokens[0];
                        cmd = cmd.toUpperCase();
                        // check if a g or m cmd was included in gcode line
                        // you are allowed to just specify coords on a line
                        // and it should be assumed that the last specified gcode
                        // cmd is what's assumed
                        isComment = false;
                        if (!cmd.match(/^(G|M|T)/i)) {
                            //console.log("no cmd so using last one. lastArgs:", this.lastArgs);
                            // we need to use the last gcode cmd
                            cmd = this.lastArgs.cmd;
                            tokens.unshift(cmd); // put at spot 0 in array
                        } else {
                            // we have a normal cmd as opposed to just an xyz pos where
                            // it assumes you should use the last cmd
                            // however, need to remove inline comments (TODO. it seems parser works fine for now)
                        }
                        
                        var args = {
                            'cmd': cmd,
                            'text': text,
                            'origtext': origtext,
                            'indx': info,
                            'isComment': isComment,
                            'feedrate': null,
                            'plane': undefined
                        };
                        
                        //console.log("args:", args);
                        if (tokens.length > 1  && !isComment) {
                            tokens.splice(1).forEach(function (token) {
                                //console.log("token:", token);
                                if (token && token.length > 0) {
                                    var key = token[0].toLowerCase();
                                    var value = parseFloat(token.substring(1));
                                    
                                    args[key] = value;
                                } else {
                                    //console.log("couldn't parse token in foreach. weird:", token);
                                }
                            });
                        }
                        var handler = this.handlers[cmd] || this.handlers['default'];

                        // don't save if saw a comment
                        if (!args.isComment) {
                            this.lastArgs = args;
                            //console.log("just saved lastArgs for next use:", this.lastArgs);
                        } else {
                            //console.log("this was a comment, so didn't save lastArgs");
                        }
                        
                        if (handler) {
                            // do extra check here for units. units are
                            // specified via G20 or G21. We need to scan
                            // each line to see if it's inside the line because
                            // we were only catching it when it was the first cmd
                            // of the line.
                            if (args.text.match(/\bG20\b/i)) {
                                console.log("SETTING UNITS TO INCHES from pre-parser!!!");
                                this.isUnitsMm = false; // false means inches cuz default is mm
                            } else if (args.text.match(/\bG21\b/i)) {
                                console.log("SETTING UNITS TO MM!!! from pre-parser");
                                this.isUnitsMm = true; // true means mm
                            }
                            
                            // scan for feedrate
                            if (args.text.match(/F([\d.]+)/i)) {
                                // we have a new feedrate
                                var feedrate = parseFloat(RegExp.$1);
                                console.log("got feedrate on this line. feedrate:", feedrate, "args:", args);
                                args.feedrate = feedrate;
                                this.lastFeedrate = feedrate;
                            } else {
                                // use feedrate from prior lines
                                args.feedrate = this.lastFeedrate;
                            }
                            
                            return handler(args, info, this);
                        } else {
                            console.error("No handler for gcode command!!!");
                        }
                            
                    }
                } else {
                    // it was a comment or the line was empty
                    // we still need to create a segment with xyz in p2
                    // so that when we're being asked to /gotoline we have a position
                    // for each gcode line, even comments. we just use the last real position
                    // to give each gcode line (even a blank line) a spot to go to
                    var args = {
                        'cmd': 'empty or comment',
                        'text': text,
                        'origtext': origtext,
                        'indx': info,
                        'isComment': isComment
                    };
                    var handler = this.handlers['default'];
                    return handler(args, info, this);
                }
            }

            this.parse = function (gcode) {
                var lines = gcode.split(/\r{0,1}\n/);
                for (var i = 0; i < lines.length; i++) {
                    if (this.parseLine(lines[i], i) === false) {
                        break;
                    }
                }
            }
        },
        
        createObjectFromGCode: function (gcode, indxMax) {
            //debugger;
            // Credit goes to https://github.com/joewalnes/gcode-viewer
            // for the initial inspiration and example code.
            // 
            // GCode descriptions come from:
            //    http://reprap.org/wiki/G-code
            //    http://en.wikipedia.org/wiki/G-code
            //    SprintRun source code
            
            var object = new THREE.Object3D();
            
            // reset our arrays
            this.parsedLines = [];
            this.lineObjects = [];
            
            this.offsetG92 = {x:0, y:0, z:0, e:0};

            var lastLine = {
                x: 0,
                y: 0,
                z: 0,
                e: 0,
                f: 0,
                feedrate: null,
                extruding: false
            };

            // we have been using an approach where we just append
            // each gcode move to one monolithic geometry. we
            // are moving away from that idea and instead making each
            // gcode move be it's own full-fledged line object with
            // its own userData info
            // G2/G3 moves are their own child of lots of lines so
            // that even the simulator can follow along better
            var plane = "G17"; //set default plane to G17 - Assume G17 if no plane specified in gcode.
            var layers = [];
            var layer = undefined;
            // TODO: lines tear out
            var totalDist = 0;
            var bbbox = {
                min: {
                    x: 100000,
                    y: 100000,
                    z: 100000
                },
                max: {
                    x: -100000,
                    y: -100000,
                    z: -100000
                }
            };
            
            this.sceneBoundaries = {
                min: {
                    x: 100000,
                    y: 100000,
                    z: 100000
                },
                max: {
                    x: -100000,
                    y: -100000,
                    z: -100000
                }
            };

            this.newLayer = function (line) {
                layer = {
                    type: {},
                    layer: layers.length,
                    z: line.z,
                };
                layers.push(layer);
            };

            this.getLineGroup = function (line, args) {
                if (layer == undefined) this.newLayer(line);
                
                var speed = Math.round(line.e / 1000);
                var grouptype = (line.extruding ? 10000 : 0) + speed;
                
                var color = new THREE.Color(line.extruding ? this.colorActive : this.colorG1);
                
                if (line.g0) {
                    grouptype =  "g0";
                    color = new THREE.Color(this.colorG0);
                } else if (line.g2) {
                    grouptype = "g2";
                    color = new THREE.Color(this.colorG2);
                } else if (line.arc) {
                    grouptype = "arc";
                    color = new THREE.Color(this.colorArc);
                }
                
                // see if we have reached indxMax, if so draw, but 
                // make it ghosted
                if (args.indx > indxMax) {
                    grouptype = "ghost";
                    color = new THREE.Color(this.colorGhosted);
                }

                if (layer.type[grouptype] == undefined) {
                    layer.type[grouptype] = {
                        type: grouptype,
                        feed: line.e,
                        extruding: line.extruding,
                        color: color,
                        segmentCount: 0,
                        material: new THREE.LineBasicMaterial({
                            opacity: line.extruding ? 0.3 : line.g2 ? 0.2 : 0.5,
                            transparent: true,
                            linewidth: this.lineWidth,
                            vertexColors: THREE.FaceColors
                        }),
                        geometry: new THREE.Geometry(),
                    }
                    if (args.indx > indxMax) {
                        layer.type[grouptype].material.opacity = 0.05;
                    }
                }
                
                return layer.type[grouptype];
            };

            this.drawArc = function(aX, aY, aZ, endaZ, aRadius, aStartAngle, aEndAngle, aClockwise, plane) {
                var ac = new THREE.ArcCurve(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise);

                var acmat = new THREE.LineBasicMaterial({
                    color: this.colorArc,
                    opacity: 0.5,
                    transparent: true
                });
                
                var geometry = new THREE.Geometry();
                var ctr = 0;
                var z = aZ;
                
                ac.getPoints(20).forEach(function (v) {
                    z = (((endaZ - aZ) / 20) * ctr) + aZ;
                    geometry.vertices.push(new THREE.Vector3(v.x, v.y, z));
                    ctr++;
                });
                
                var aco = new THREE.Line( this.convertLineGeometryToBufferGeometry(geometry, new THREE.Color(this.colorArc)), acmat );
                
                return aco;
            };
            
            this.drawArcFrom2PtsAndCenter = function(vp1, vp2, vpArc, args) {
                // Find angle
                var p1deltaX = vpArc.x - vp1.x;
                var p1deltaY = vpArc.y - vp1.y; 
                var p1deltaZ = vpArc.z - vp1.z;

                var p2deltaX = vpArc.x - vp2.x;
                var p2deltaY = vpArc.y - vp2.y; 
                var p2deltaZ = vpArc.z - vp2.z;

                switch (args.plane) {
                    case "G18":
                        var anglepArcp1 = Math.atan(p1deltaZ / p1deltaX);
                        var anglepArcp2 = Math.atan(p2deltaZ / p2deltaX);
                        break;
                    case "G19":
                        var anglepArcp1 = Math.atan(p1deltaZ / p1deltaY);
                        var anglepArcp2 = Math.atan(p2deltaZ / p2deltaY);
                        break;
                    default:
                        var anglepArcp1 = Math.atan(p1deltaY / p1deltaX);
                        var anglepArcp2 = Math.atan(p2deltaY / p2deltaX);
                }
                
                // Draw arc from arc center
                var radius = vpArc.distanceTo(vp1);
                var radius2 = vpArc.distanceTo(vp2);
                
                if (Number((radius).toFixed(2)) != Number((radius2).toFixed(2))) {
                    console.log("Radiuses not equal. r1:", radius, ", r2:", radius2, " with args:", args, " rounded vals r1:", Number((radius).toFixed(2)), ", r2:", Number((radius2).toFixed(2)));
                }
                
                // arccurve
                var clwise = true;
                if (args.clockwise === false) clwise = false;

                switch (args.plane) {
                    case "G19":
                        if (p1deltaY >= 0) anglepArcp1 += Math.PI;
                        if (p2deltaY >= 0) anglepArcp2 += Math.PI;
                        break;
                    default:
                        if (p1deltaX >= 0) anglepArcp1 += Math.PI;
                        if (p2deltaX >= 0) anglepArcp2 += Math.PI;
                }
                
                if (anglepArcp1 === anglepArcp2 && clwise === false) {
                    // Draw full circle if angles are both zero, 
                    // start & end points are same point... I think
                    switch (args.plane) {
                        case "G18":
                            var threeObj = this.drawArc(vpArc.x, vpArc.z, (-1*vp1.y), (-1*vp2.y), radius, anglepArcp1, (anglepArcp2 + (2*Math.PI)), clwise, "G18");
                            break;
                        case "G19":
                            var threeObj = this.drawArc(vpArc.y, vpArc.z, vp1.x, vp2.x, radius, anglepArcp1, (anglepArcp2 + (2*Math.PI)), clwise, "G19");
                            break;
                        default:
                            var threeObj = this.drawArc(vpArc.x, vpArc.y, vp1.z, vp2.z, radius, anglepArcp1, (anglepArcp2 + (2*Math.PI)), clwise, "G17");
                    }
                } else {
                    switch (args.plane) {
                        case "G18":
                            var threeObj = this.drawArc(vpArc.x, vpArc.z, (-1*vp1.y), (-1*vp2.y), radius, anglepArcp1, anglepArcp2, clwise, "G18");
                            break;
                        case "G19":
                            var threeObj = this.drawArc(vpArc.y, vpArc.z, vp1.x, vp2.x, radius, anglepArcp1, anglepArcp2, clwise, "G19");
                            break;
                        default:
                            var threeObj = this.drawArc(vpArc.x, vpArc.y, vp1.z, vp2.z, radius, anglepArcp1, anglepArcp2, clwise, "G17");
                    }
                }
                
                return threeObj;
            };
            
            this.addSegment = function(p1, p2, args) {
                var group = this.getLineGroup(p2, args);
                var geometry = group.geometry;

                group.segmentCount++;
                // see if we need to draw an arc
                if (p2.arc) {
                    var vp1 = new THREE.Vector3(p1.x, p1.y, p1.z);
                    var vp2 = new THREE.Vector3(p2.x, p2.y, p2.z);
                    
                    var vpArc;
                    
                    // if this is an R arc gcode command, we're given the radius, so we
                    // don't have to calculate it. however we need to determine center
                    // of arc
                    if (args.r != null) {
                        radius = parseFloat(args.r);
                        
                        // First, find the distance between points 1 and 2.  We'll call that q, 
                        // and it's given by sqrt((x2-x1)^2 + (y2-y1)^2).
                        var q = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));

                        // Second, find the point halfway between your two points.  We'll call it 
                        // (x3, y3).  x3 = (x1+x2)/2  and  y3 = (y1+y2)/2.  
                        var x3 = (p1.x + p2.x) / 2;
                        var y3 = (p1.y + p2.y) / 2;
                        var z3 = (p1.z + p2.z) / 2;
                        
                        // There will be two circle centers as a result of this, so
                        // we will have to pick the correct one. In gcode we can get
                        // a + or - val on the R to indicate which circle to pick
                        // One answer will be:
                        // x = x3 + sqrt(r^2-(q/2)^2)*(y1-y2)/q
                        // y = y3 + sqrt(r^2-(q/2)^2)*(x2-x1)/q  
                        // The other will be:
                        // x = x3 - sqrt(r^2-(q/2)^2)*(y1-y2)/q
                        // y = y3 - sqrt(r^2-(q/2)^2)*(x2-x1)/q  
                        var pArc_1 = undefined;
                        var pArc_2 = undefined;
                        var calc = Math.sqrt((radius * radius) - Math.pow(q / 2, 2));
                        var angle_point = undefined;
                        
                        switch (args.plane) {
                            case "G18":
                                pArc_1 = {
                                    x: x3 + calc * (p1.z - p2.z) / q,
                                    y: y3 + calc * (p2.y - p1.y) / q, 
                                    z: z3 + calc * (p2.x - p1.x) / q };
                                pArc_2 = {
                                    x: x3 - calc * (p1.z - p2.z) / q,
                                    y: y3 - calc * (p2.y - p1.y) / q, 
                                    z: z3 - calc * (p2.x - p1.x) / q };
                                angle_point = Math.atan2(p1.z, p1.x) - Math.atan2(p2.z, p2.x);
                                if(((p1.x-pArc_1.x)*(p1.z+pArc_1.z))+((pArc_1.x-p2.x)*(pArc_1.z+p2.z)) >= 
                                   ((p1.x-pArc_2.x)*(p1.z+pArc_2.z))+((pArc_2.x-p2.x)*(pArc_2.z+p2.z))){
                                    var cw = pArc_1;
                                    var ccw = pArc_2;
                                }
                                else{
                                    var cw = pArc_2;
                                    var ccw = pArc_1;
                                }
                                break;
                            case "G19":
                                pArc_1 = {
                                    x: x3 + calc * (p1.x - p2.x) / q,
                                    y: y3 + calc * (p1.z - p2.z) / q, 
                                    z: z3 + calc * (p2.y - p1.y) / q };
                                pArc_2 = {
                                    x: x3 - calc * (p1.x - p2.x) / q,
                                    y: y3 - calc * (p1.z - p2.z) / q, 
                                    z: z3 - calc * (p2.y - p1.y) / q };
                                
                                if(((p1.y-pArc_1.y)*(p1.z+pArc_1.z))+((pArc_1.y-p2.y)*(pArc_1.z+p2.z)) >= 
                                   ((p1.y-pArc_2.y)*(p1.z+pArc_2.z))+((pArc_2.y-p2.y)*(pArc_2.z+p2.z))){
                                    var cw = pArc_1;
                                    var ccw = pArc_2;
                                }
                                else{
                                    var cw = pArc_2;
                                    var ccw = pArc_1;
                                }
                                break;
                            default:
                                pArc_1 = {
                                    x: x3 + calc * (p1.y - p2.y) / q,
                                    y: y3 + calc * (p2.x - p1.x) / q, 
                                    z: z3 + calc * (p2.z - p1.z) / q };
                                pArc_2 = {
                                    x: x3 - calc * (p1.y - p2.y) / q,
                                    y: y3 - calc * (p2.x - p1.x) / q, 
                                    z: z3 - calc * (p2.z - p1.z) / q };
                                if(((p1.x-pArc_1.x)*(p1.y+pArc_1.y))+((pArc_1.x-p2.x)*(pArc_1.y+p2.y)) >= 
                                   ((p1.x-pArc_2.x)*(p1.y+pArc_2.y))+((pArc_2.x-p2.x)*(pArc_2.y+p2.y))){
                                    var cw = pArc_1;
                                    var ccw = pArc_2;
                                }
                                else{
                                    var cw = pArc_2;
                                    var ccw = pArc_1;
                                }
                        }
                        
                        if ((p2.clockwise === true && radius >= 0) || (p2.clockwise === false && radius < 0)) {
                            vpArc = new THREE.Vector3(cw.x, cw.y, cw.z);
                        } else {
                            vpArc = new THREE.Vector3(ccw.x, ccw.y, ccw.z);
                        } 
                        
                    } else {
                        var pArc = {
                            x: p2.arci ? p1.x + p2.arci : p1.x,
                            y: p2.arcj ? p1.y + p2.arcj : p1.y,
                            z: p2.arck ? p1.z + p2.arck : p1.z,
                        };
                        
                        vpArc = new THREE.Vector3(pArc.x, pArc.y, pArc.z);
                    }
                    
                    var threeObjArc = this.drawArcFrom2PtsAndCenter(vp1, vp2, vpArc, args);
                    
                    // still push the normal p1/p2 point for debug
                    p2.g2 = true;
                    p2.threeObjArc = threeObjArc;
                    
                    group = this.getLineGroup(p2, args);
                } else {
                    geometry.vertices.push(new THREE.Vector3(p1.x, p1.y, p1.z));
                    geometry.vertices.push(new THREE.Vector3(p2.x, p2.y, p2.z));
                    
                    geometry.colors.push(group.color);
                    geometry.colors.push(group.color);
                }
                
                if (p2.extruding) {
                    bbbox.min.x = Math.min(bbbox.min.x, p2.x);
                    bbbox.min.y = Math.min(bbbox.min.y, p2.y);
                    bbbox.min.z = Math.min(bbbox.min.z, p2.z);
                    bbbox.max.x = Math.max(bbbox.max.x, p2.x);
                    bbbox.max.y = Math.max(bbbox.max.y, p2.y);
                    bbbox.max.z = Math.max(bbbox.max.z, p2.z);
                }
                
                // global bounding box calc
                this.sceneBoundaries.min.x = Math.min(this.sceneBoundaries.min.x, p2.x);
                this.sceneBoundaries.min.y = Math.min(this.sceneBoundaries.min.y, p2.y);
                this.sceneBoundaries.min.z = Math.min(this.sceneBoundaries.min.z, p2.z);
                this.sceneBoundaries.max.x = Math.max(this.sceneBoundaries.max.x, p2.x);
                this.sceneBoundaries.max.y = Math.max(this.sceneBoundaries.max.y, p2.y);
                this.sceneBoundaries.max.z = Math.max(this.sceneBoundaries.max.z, p2.z);
                
                // NEW METHOD OF CREATING THREE.JS OBJECTS
                // create new approach for three.js objects which is
                // a unique object for each line of gcode, including g2/g3's
                // make sure userData is good too
                var gcodeObj;
                
                if (p2.arc) {
                    // use the arc that already got built
                    gcodeObj = p2.threeObjArc;
                } else {
                    // make a line
                    var color = this.colorArc;
                    
                    if (p2.extruding) {
                        color = this.colorActive;
                    } else if (p2.g0) {
                        color = this.colorG0;
                    } else if (p2.g2) {
                        color = this.colorG2;
                    } else if (p2.arc) {
                        color = this.colorArc;
                    }
                    
                    var material = new THREE.LineBasicMaterial({
                        color: color,
                        opacity: 0.5,
                        transparent: true
                    });
                    
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(
                        new THREE.Vector3( p1.x, p1.y, p1.z ),
                        new THREE.Vector3( p2.x, p2.y, p2.z ),
                        new THREE.Vector3( p2.x, p2.y, p2.z ) // HAX, to fix createGlow error with straight lines
                    );
                    
                    gcodeObj = new THREE.Line( this.convertLineGeometryToBufferGeometry(geometry, new THREE.Color(color)), material );
                }
                
                gcodeObj.userData.p2 = p2;
                gcodeObj.userData.args = args;
                
                
                // DISTANCE CALC
                // add distance so we can calc estimated time to run
                // see if arc
                var dist = 0;
                if (p2.arc) {
                    // calc dist of all lines
                    var arcGeo = new THREE.Geometry().fromBufferGeometry(p2.threeObjArc.geometry);
                                        
                    var tad2 = 0;
                    for (var arcLineCtr = 0; arcLineCtr < arcGeo.vertices.length - 1; arcLineCtr++) {
                        tad2 += arcGeo.vertices[arcLineCtr].distanceTo(arcGeo.vertices[arcLineCtr+1]);
                    }
                    
                    // just do straight line calc
                    var a = new THREE.Vector3( p1.x, p1.y, p1.z );
                    var b = new THREE.Vector3( p2.x, p2.y, p2.z );
                    var straightDist = a.distanceTo(b);
                                        
                    dist = tad2;
                    
                } else {
                    // just do straight line calc
                    var a = new THREE.Vector3( p1.x, p1.y, p1.z );
                    var b = new THREE.Vector3( p2.x, p2.y, p2.z );
                    
                    dist = a.distanceTo(b);
                }
                
                if (dist > 0) {
                    this.totalDist += dist;
                }
                
                // time to execute this move
                // if this move is 10mm and we are moving at 100mm/min then
                // this move will take 10/100 = 0.1 minutes or 6 seconds
                var timeMinutes = 0;
                if (dist > 0) {
                    var fr;
                    if (args.feedrate > 0) {
                        fr = args.feedrate
                    } else {
                        fr = 100;
                    }
                    timeMinutes = dist / fr;
                    
                    // adjust for acceleration, meaning estimate
                    // this will run longer than estimated from the math
                    // above because we don't start moving at full feedrate
                    // obviously, we have to slowly accelerate in and out
                    timeMinutes = timeMinutes * 1.32;
                }
                this.totalTime += timeMinutes;

                p2.feedrate = args.feedrate;
                p2.dist = dist;
                p2.distSum = this.totalDist;
                p2.timeMins = timeMinutes;
                p2.timeMinsSum = this.totalTime;
                
                object.add(gcodeObj);
                
                // add segment to array for later use
                this.parsedLines.push({
                    'p2': p2,
                    'args': args,
                    'renderObject': gcodeObj
                });
                
                this.lineObjects.push(gcodeObj);
            }
            
            this.totalDist = 0;
            this.totalTime = 0;
            
            var relative = false;

            this.delta = function (v1, v2) {
                return relative ? v2 : v2 - v1;
            }

            this.absolute = function (v1, v2) {
                return relative ? v1 + v2 : v2;
            }

            this.addFakeSegment = function(args) {
                //line.args = args;
                var arg2 = {
                    isFake : true,
                    text : args.text,
                    indx : args.indx
                };
                
                if (arg2.text.match(/^(;|\(|<)/)) arg2.isComment = true;

                this.parsedLines.push({
                    'p2': lastLine,    // since this is fake, just use lastLine as xyz
                    'args': arg2,
                    'renderObject': null
                });
            }

            var cofg = this;
            var parser = new this.GCodeParser({
                //set the g92 offsets for the parser - defaults to no offset
                /* When doing CNC, generally G0 just moves to a new location
                as fast as possible which means no milling or extruding is happening in G0.
                So, let's color it uniquely to indicate it's just a toolhead move. */
                G0: function (args, indx) {
                    var newLine = {
                        x: args.x !== undefined ? cofg.absolute(lastLine.x, args.x) + cofg.offsetG92.x : lastLine.x,
                        y: args.y !== undefined ? cofg.absolute(lastLine.y, args.y) + cofg.offsetG92.y : lastLine.y,
                        z: args.z !== undefined ? cofg.absolute(lastLine.z, args.z) + cofg.offsetG92.z : lastLine.z,
                        e: args.e !== undefined ? cofg.absolute(lastLine.e, args.e) + cofg.offsetG92.e : lastLine.e,
                        f: args.f !== undefined ? cofg.absolute(lastLine.f, args.f) : lastLine.f,
                    };
                    
                    newLine.g0 = true;
                    
                    cofg.addSegment(lastLine, newLine, args);
                    
                    lastLine = newLine;
                },  
                G1: function (args, indx) {
                    // Example: G1 Z1.0 F3000
                    //          G1 X99.9948 Y80.0611 Z15.0 F1500.0 E981.64869
                    //          G1 E104.25841 F1800.0
                    // Go in a straight line from the current (X, Y) point
                    // to the point (90.6, 13.8), extruding material as the move
                    // happens from the current extruded length to a length of
                    // 22.4 mm.
                    var newLine = {
                        x: args.x !== undefined ? cofg.absolute(lastLine.x, args.x) + cofg.offsetG92.x : lastLine.x,
                        y: args.y !== undefined ? cofg.absolute(lastLine.y, args.y) + cofg.offsetG92.y : lastLine.y,
                        z: args.z !== undefined ? cofg.absolute(lastLine.z, args.z) + cofg.offsetG92.z : lastLine.z,
                        e: args.e !== undefined ? cofg.absolute(lastLine.e, args.e) + cofg.offsetG92.e : lastLine.e,
                        f: args.f !== undefined ? cofg.absolute(lastLine.f, args.f) : lastLine.f,

                    };
                    
                    /* layer change detection is or made by watching Z, it's made by 
                    watching when we extrude at a new Z position */
                    if (cofg.delta(lastLine.e, newLine.e) > 0) {
                        newLine.extruding = cofg.delta(lastLine.e, newLine.e) > 0;
                        if (layer == undefined || newLine.z != layer.z) cofg.newLayer(newLine);
                    }
                    cofg.addSegment(lastLine, newLine, args);
                    
                    lastLine = newLine;
                },
                G2: function (args, indx, gcp) {
                    /* this is an arc move from lastLine's xy to the new xy. we'll
                    show it as a light gray line, but we'll also sub-render the
                    arc itself by figuring out the sub-segments . */
                    args.plane = plane; //set the plane for this command to whatever the current plane is
                    
                    var newLine = {
                        x: args.x !== undefined ? cofg.absolute(lastLine.x, args.x) + cofg.offsetG92.x : lastLine.x,
                        y: args.y !== undefined ? cofg.absolute(lastLine.y, args.y) + cofg.offsetG92.y : lastLine.y,
                        z: args.z !== undefined ? cofg.absolute(lastLine.z, args.z) + cofg.offsetG92.z : lastLine.z,
                        e: args.e !== undefined ? cofg.absolute(lastLine.e, args.e) + cofg.offsetG92.e : lastLine.e,
                        f: args.f !== undefined ? cofg.absolute(lastLine.f, args.f) : lastLine.f,
                        arci: args.i ? args.i : null,
                        arcj: args.j ? args.j : null,
                        arck: args.k ? args.k : null,
                        arcr: args.r ? args.r : null,
                    };
                    
                    newLine.arc = true;
                    newLine.clockwise = true;
                    if (args.clockwise === false) newLine.clockwise = args.clockwise;
                    cofg.addSegment(lastLine, newLine, args);
                    
                    lastLine = newLine;
                },
                G3: function (args, indx, gcp) {
                    /* this is an arc move from lastLine's xy to the new xy. same
                    as G2 but reverse*/
                    args.arc = true;
                    args.clockwise = false;
                    gcp.handlers.G2(args, indx, gcp);
                },

                G17: function (args){
                    console.log("SETTING XY PLANE");
                    plane = "G17";
                    cofg.addFakeSegment(args);
                },

                G18: function (args){
                    console.log("SETTING XZ PLANE");
                    plane = "G18";
                    cofg.addFakeSegment(args);
                },

                G19: function (args){
                    console.log("SETTING YZ PLANE");
                    plane = "G19";
                    cofg.addFakeSegment(args);
                },

                G20: function (args) {
                    // G21: Set Units to Inches
                    // We don't really have to do anything since 3d viewer is unit agnostic
                    // However, we need to set a global property so the trinket decorations
                    // like toolhead, axes, grid, and extent labels are scaled correctly
                    // later on when they are drawn after the gcode is rendered
                    console.log("SETTING UNITS TO INCHES!!!");
                    cofg.isUnitsMm = false; // false means inches cuz default is mm
                    cofg.addFakeSegment(args);

                },

                G21: function (args) {
                    // G21: Set Units to Millimeters
                    // Example: G21
                    // Units from now on are in millimeters. (This is the RepRap default.)
                    console.log("SETTING UNITS TO MM!!!");
                    cofg.isUnitsMm = true; // true means mm
                    cofg.addFakeSegment(args);

                },

                G73: function(args, indx, gcp) {
                    // peck drilling. just treat as g1
                    console.log("G73 gcp:", gcp);
                    gcp.handlers.G1(args);
                },
                G90: function (args) {
                    // G90: Set to Absolute Positioning
                    // Example: G90
                    // All coordinates from now on are absolute relative to the
                    // origin of the machine. (This is the RepRap default.)

                    relative = false;
                    cofg.addFakeSegment(args);
                },

                G91: function (args) {
                    // G91: Set to Relative Positioning
                    // Example: G91
                    // All coordinates from now on are relative to the last position.

                    // TODO!
                    relative = true;
                    cofg.addFakeSegment(args);
                },

                G92: function (args) { // E0
                    // G92: Set Position
                    // Example: G92 E0
                    // Allows programming of absolute zero point, by reseting the
                    // current position to the values specified. This would set the
                    // machine's X coordinate to 10, and the extrude coordinate to 90.
                    // No physical motion will occur.

                    // TODO: Only support E0
                    var newLine = lastLine;
                    
                    cofg.offsetG92.x = (args.x !== undefined ? (args.x === 0 ? newLine.x : newLine.x - args.x) : 0);
                    cofg.offsetG92.y = (args.y !== undefined ? (args.y === 0 ? newLine.y : newLine.y - args.y) : 0);
                    cofg.offsetG92.z = (args.z !== undefined ? (args.z === 0 ? newLine.z : newLine.z - args.z) : 0);
                    cofg.offsetG92.e = (args.e !== undefined ? (args.e === 0 ? newLine.e : newLine.e - args.e) : 0);
                    
                    cofg.addFakeSegment(args);
                },
                M30: function (args) {
                    cofg.addFakeSegment(args);
                },
                M82: function (args) {
                    // M82: Set E codes absolute (default)
                    // Descriped in Sprintrun source code.

                    // No-op, so long as M83 is not supported.
                    cofg.addFakeSegment(args);
                },

                M84: function (args) {
                    // M84: Stop idle hold
                    // Example: M84
                    // Stop the idle hold on all axis and extruder. In some cases the
                    // idle hold causes annoying noises, which can be stopped by
                    // disabling the hold. Be aware that by disabling idle hold during
                    // printing, you will get quality issues. This is recommended only
                    // in between or after printjobs.

                    // No-op
                    cofg.addFakeSegment(args);
                },

                'default': function (args, info) {
                    //if (!args.isComment)
                    //    console.log('Unknown command:', args.cmd, args, info);
                    cofg.addFakeSegment(args);
                },
            });

            parser.parse(gcode);

            // set what units we're using in the gcode
            //console.log('setting units from parser to 3dviewer. parser:', parser, "this:", this);
            this.isUnitsMm = parser.isUnitsMm;
            
            console.log("inside creatGcodeFromObject. this:", this);
            console.log("Layer Count ", layers.length);
            
            // Center
            var scale = 1; // TODO: Auto size

            var center = new THREE.Vector3(
            bbbox.min.x + ((bbbox.max.x - bbbox.min.x) / 2),
            bbbox.min.y + ((bbbox.max.y - bbbox.min.y) / 2),
            bbbox.min.z + ((bbbox.max.z - bbbox.min.z) / 2));
            
            console.log("center ", center);

            this.sceneCenter = new THREE.Vector3(
            this.sceneBoundaries.min.x + ((this.sceneBoundaries.max.x - this.sceneBoundaries.min.x) / 2),
            this.sceneBoundaries.min.y + ((this.sceneBoundaries.max.y - this.sceneBoundaries.min.y) / 2),
            this.sceneBoundaries.min.z + ((this.sceneBoundaries.max.z - this.sceneBoundaries.min.z) / 2));
            
            console.log("final object:", object);

            return object;
        },
        
        
        convertLineGeometryToBufferGeometry: function(lineGeometry, color) {
            var positions = new Float32Array( lineGeometry.vertices.length * 3 );
            var colors = new Float32Array( lineGeometry.vertices.length * 3 );
            
            var r = 800;
            
            var geometry = new THREE.BufferGeometry();
            
            for (var i = 0; i < lineGeometry.vertices.length; i++) {
                var x = lineGeometry.vertices[i].x;
                var y = lineGeometry.vertices[i].y;
                var z = lineGeometry.vertices[i].z;

                // positions
                positions[ i * 3 ] = x;
                positions[ i * 3 + 1 ] = y;
                positions[ i * 3 + 2 ] = z;

                // colors
                colors[ i * 3 ] = color.r;
                colors[ i * 3 + 1 ] = color.g;
                colors[ i * 3 + 2 ] = color.b;
            }
            
            geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
            
            geometry.computeBoundingSphere();
            
            return geometry;
        },
    }
        
});
