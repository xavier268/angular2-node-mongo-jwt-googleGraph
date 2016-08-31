/**
*      This directive will draw a chart from the array of records provided
*
*           Note : the relevant jsapi scripts should be already available
*                  globally in the window.google object (see index.html)
**/
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var ChartDirective = (function () {
    function ChartDirective(elementRef) {
        this._content = [];
        this._title = "";
        this._nbd = new Date(0);
        console.log("Constructing chart directive");
        this.w = window;
        this.el = elementRef.nativeElement;
        // console.log("Native HTML :", this.el);
        if (!this.w.google) {
            console.error("Hey ! It seems the need google script was not loaded ?");
        }
        ;
    }
    Object.defineProperty(ChartDirective.prototype, "content", {
        get: function () { return this._content; },
        // Setter for content will trigger drawing (or refreshing)
        set: function (c) {
            console.log("Setting content ...");
            this._content = c;
            this.draw();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDirective.prototype, "title", {
        get: function () { return this._title; },
        // title will appear above graph if not null
        set: function (t) { this._title = t; this.draw(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDirective.prototype, "notBefore", {
        get: function () { return this._nbd; },
        // Exclude records that are before that date
        //  (use for zooming ...)
        set: function (d) { this._nbd = d; this.draw(); },
        enumerable: true,
        configurable: true
    });
    ChartDirective.prototype.draw = function () {
        // Create the data table.
        var data = new this.w.google.visualization.DataTable();
        data.addColumn("date", "Quand");
        data.addColumn("number", "KG");
        var rows = [];
        for (var c in this._content) {
            var d = new Date(this._content[c].quand);
            var k = +(this._content[c].kg); // Plus sign to force conversion sting -> number
            // Only take into account records after the 'notBefore date'
            if (d >= this._nbd)
                rows.push([d, k]);
        }
        data.addRows(rows);
        // Create options
        var options = {
            // "width": 600,
            "height": 300,
            "curveType": "function"
        };
        if (this._title)
            options.title = this._title;
        // Instantiate and draw our chart, passing in some options.
        (new this.w.google.visualization.LineChart(this.el))
            .draw(data, options);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array), 
        __metadata('design:paramtypes', [Array])
    ], ChartDirective.prototype, "content", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], ChartDirective.prototype, "title", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Date), 
        __metadata('design:paramtypes', [Date])
    ], ChartDirective.prototype, "notBefore", null);
    ChartDirective = __decorate([
        core_1.Directive({
            selector: "chart",
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], ChartDirective);
    return ChartDirective;
}());
exports.ChartDirective = ChartDirective;
