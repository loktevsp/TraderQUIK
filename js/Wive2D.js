function Random(min, max) {return Math.floor(Math.random() * (max - min)) + min;}
function log(_text){console.log('[Log]: '+_text);}
function clone(obj)
{
    var temp = {};
    var tempA = [];
    if(obj.push)
    {
        for(var i = 0; i < obj.length; i++)
            tempA[i] = clone(obj[i]);
        return tempA;
    }
    for(var key in obj)
    {
        if(obj[key] == null || typeof(obj[key]) != 'object')
            {temp[key] = obj[key];}
        else if(obj[key].Clone)
            {temp[key] = obj[key].Clone();}
        else
            temp[key] = clone(obj[key]);
    }
    return temp;
}

Vector2D = function (_x,_y,_obj){ return {x: _x, y: _y,
object:_obj||null,
Set: function(_x,_y)
{
    if(!this.isEquel({_x,_y}))
    {
        this.x = _x;
        this.y = _y;
        if(this.object)
            this.object.isRender = false;
        return;
    }

    if(this.object)
        this.object.isRender = true;
},
Clone: function()
{
    return clone(this);
},
isEquel: function(_v)
{
    if(this.x == _v.x && this.y == _v.y) return true;
    return false;
},
MoveTo: function(_v,_s)
{
    if(this.isEquel(_v)) return;

    this.x += (_v.x-this.x)*_s;
    this.y += (_v.y-this.y)*_s;
},
Move: function(_x,_y)
{
    this.x += _x;
    this.y += _y;
}
}; }

var requestAnimationFrame = (function()
{
    return window.requestAnimationFrame||
            window.webkitRequestAnimationFrame||
            window.mozRequestAnimationFrame||
            window.oRequestAnimationFrame||
            window.msRequestAnimationFrame||
            function(callback)
            { window.setTimeout(callback, 1000 / 60);}
})();

/*------------------------------------------*/
/*---------------Wive2D Engine--------------*/
/*------------------------------------------*/

Wive2D = {};
Wive2D.ObjsCount = 0;
Wive2D.Zoom = 1;

Wive2D.SetFuncRender = function (_function)
{
    Wive2D.InitInput();
    Wive2D.CurrentRender = _function;
    requestAnimationFrame(Wive2D._Wive2DRender);
}

Wive2D._Wive2DRender = function()
{
    /*if(!Wive2D.Logo.Hide()) 
    { 
        Wive2D.Logo.Render(); 
        requestAnimationFrame(Wive2D._Wive2DRender); 
        return;
    }*/

    if(!Wive2D.CurrentRender) return;

    Wive2D.CurrentRender();

    requestAnimationFrame(Wive2D._Wive2DRender);
}

/*---------------Begin Object---------------*/
{
    Wive2D.Object = function()
    {
        this.Visible = true;
        
        this.id = Wive2D.ObjsCount++;
        this.Event = 
        {
            isRender:false
        };
            
        this.Position = Vector2D(0, 0, this.Event);
        this.Size = Vector2D(100, 100, this.Event);
        this.Flip = Vector2D(0, 0, this.Event);
        this.Angle = 0;
        this.Box = {
            Position: Vector2D(0, 0),
            Size: Vector2D(0, 0)
        };
        this.Parent = null;
    }
    Wive2D.Object.prototype =
    {
        constructor: Wive2D.Object,

        GetDistace: function(_obj)
        {
            return Math.ceil(Math.sqrt(Math.pow(_obj.Position.x - this.Position.x, 2)+
            Math.pow(_obj.Position.y - this.Position.y, 2)));
        },
        
        onObject: function (_camerapos = Vector2D(0, 0)) 
        {
            return( (this.Position.x) * Wive2D.Zoom + _camerapos.x +(this.Box.Size.x * Wive2D.Zoom)/2 >= Wive2D.Mouse.x) &&
                  ( (this.Position.x) * Wive2D.Zoom + _camerapos.x-(this.Box.Size.x * Wive2D.Zoom)/2 <= Wive2D.Mouse.x) &&
                  
                  ( (this.Position.y) * Wive2D.Zoom + _camerapos.y+(this.Box.Size.y * Wive2D.Zoom)/2 >= Wive2D.Mouse.y) &&
                  ( (this.Position.y) * Wive2D.Zoom + _camerapos.y-(this.Box.Size.y * Wive2D.Zoom)/2 <= Wive2D.Mouse.y);
        },
        
        isCollision: function (_obj, _camerapos = Vector2D(0, 0))
        {
            return( this.Position.x * Wive2D.Zoom + _camerapos.x+this.Box.Position.x * Wive2D.Zoom + _camerapos.x+(this.Box.Size.x * Wive2D.Zoom + _camerapos.x)/2 >= _obj.Position.x * Wive2D.Zoom + _camerapos.x+_obj.Box.Position.x * Wive2D.Zoom + _camerapos.x-(_obj.Box.Size.x * Wive2D.Zoom + _camerapos.x)/2) &&
                  ( this.Position.x * Wive2D.Zoom + _camerapos.x+this.Box.Position.x * Wive2D.Zoom + _camerapos.x-(this.Box.Size.x * Wive2D.Zoom + _camerapos.x)/2 <= _obj.Position.x * Wive2D.Zoom + _camerapos.x+_obj.Box.Position.x * Wive2D.Zoom + _camerapos.x+(_obj.Box.Size.x * Wive2D.Zoom + _camerapos.x)/2) &&
                  
                  ( this.Position.y * Wive2D.Zoom + _camerapos.y+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y+(this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y)/2 >= _obj.Position.y *  Wive2D.Zoom+ _camerapos.y+_obj.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-(_obj.Box.Size.y *  Wive2D.Zoom+ _camerapos.y)/2) &&
                  ( this.Position.y *  Wive2D.Zoom+ _camerapos.y+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-(this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y)/2 <= _obj.Position.y *  Wive2D.Zoom+ _camerapos.y+_obj.Box.Position.y *  Wive2D.Zoom+ _camerapos.y+(_obj.Box.Size.y *  Wive2D.Zoom+ _camerapos.y)/2);
        },
        
        DrawCollisionBox: function(_Context, _camerapos = Vector2D(0, 0))
        {            
            _Context.beginPath();
            _Context.moveTo(this.Position.x *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.x *  Wive2D.Zoom+ _camerapos.x-(this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x)/2, this.Position.y *  Wive2D.Zoom+ _camerapos.y+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-(this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y)/2);
            _Context.lineTo(this.Position.x *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.x *  Wive2D.Zoom+ _camerapos.x-(this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x)/2, this.Position.y *  Wive2D.Zoom+ _camerapos.y+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y/2+this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y);
            
            _Context.moveTo(this.Position.x *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.x *  Wive2D.Zoom+ _camerapos.x-(this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x)/2, this.Position.y *  Wive2D.Zoom+ _camerapos.y+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-(this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y)/2);
            _Context.lineTo(this.Position.x *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.x *  Wive2D.Zoom+ _camerapos.x-this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x/2+this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x, this.Position.y *  Wive2D.Zoom+ _camerapos.y+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y/2);
            
            _Context.moveTo(this.Position.x *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.x *  Wive2D.Zoom+ _camerapos.x-this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x/2+this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x, this.Position.y *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y/2);
            _Context.lineTo(this.Position.x *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.x *  Wive2D.Zoom+ _camerapos.x+(this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x)/2, this.Position.y *  Wive2D.Zoom+ _camerapos.y+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y/2+this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y);
            
            _Context.moveTo(this.Position.x *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.x *  Wive2D.Zoom+ _camerapos.x-(this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x)/2, this.Position.y *  Wive2D.Zoom+ _camerapos.y+this.Box.Position.y-this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y/2+this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y);
            _Context.lineTo(this.Position.x *  Wive2D.Zoom+ _camerapos.x+this.Box.Position.x *  Wive2D.Zoom+ _camerapos.x+(this.Box.Size.x *  Wive2D.Zoom+ _camerapos.x)/2, this.Position.y *  Wive2D.Zoom+ _camerapos.y+this.Box.Position.y *  Wive2D.Zoom+ _camerapos.y-this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y/2+this.Box.Size.y *  Wive2D.Zoom+ _camerapos.y);            
            
            _Context.lineWidth = 2 * Wive2D.Zoom;
            _Context.strokeStyle = '#ff0';
            _Context.stroke();
        }
    }
}
/*---------------End Object---------------*/

/*---------------Begin Text---------------*/
Wive2D.Text = function(_l)
{
    Wive2D.Object.call(this);
    
    this.layer = _l;
    this.text = 'lable';
    this.align = '';
    this.color = '#FFF';
    this.lineWidth = 1;
}
Wive2D.Text.prototype = Object.create(Wive2D.Object.prototype);
Wive2D.Text.prototype.SetLayer = function (_l) 
{
    this.layer = l;
}
Wive2D.Text.prototype.SetPosition = function (_x, _y) 
{
    this.Position = Vector2D(_x,_y);
    this.Box.Position = Vector2D(_x,_y);
    this.Box.Size = Vector2D(this.layer.Context.measureText(this.text).width, 14);
    if(this.align  == 'center')
    {
        this.Position.x-=this.Box.Size.x/2;
        this.Position.y-=this.Box.Size.y;
    } 
},
Wive2D.Text.prototype.Draw = function () 
{
    this.layer.Context.fillStyle =  this.color ;
    this.layer.Context.strokeStyle = 'rgb(90,90,90)';
    this.layer.Context.textBaseline = 'top';
    this.layer.Context.font = 0;
    this.layer.Context.lineWidth = this.lineWidth * Wive2D.Zoom; 
        
    this.layer.Context.strokeText(this.text, this.Position.x * Wive2D.Zoom + this.layer.Camera.Position.x, this.Position.y * Wive2D.Zoom + this.layer.Camera.Position.y);
    this.layer.Context.fillText(this.text, this.Position.x * Wive2D.Zoom + this.layer.Camera.Position.x, this.Position.y * Wive2D.Zoom + this.layer.Camera.Position.y); 
}
Wive2D.Text.prototype.DrawOpt = function (_x,_y,_text,_font,_colorF,_colorS,_lineWidth,_align) 
{
    this.Position = Vector2D(_x,_y);
    this.Box.Size = Vector2D(this.layer.Context.measureText(_text).width, 2);

    this.Context.textBaseline = _align || 'top';
    if (_font) _font.sizethis.Context.font = _font;

    this.Context.fillStyle = _colorF || '#000';

    if(_align == 'center') 
    {
        if (_colorS) 
        {
            this.Context.lineWidth = _lineWidth || 1;
            his.Context.strokeStyle = _colorS;
            this.Context.strokeText(_text, _x-this.Box.Size.x, _y);
        }
        this.Context.fillText(_text, _x-this.Box.Size.x, _y); 
    }
    else
    {
        if (_colorS) 
        {
            this.Context.lineWidth = _lineWidth || 1;
            this.Context.strokeStyle = _colorS;
            this.Context.strokeText(_text, _x, _y);
        }  
        this.Context.fillText(_text, _x, _y);
    }
}
/*---------------End Text---------------*/

/*---------------Begin Line---------------*/
{
    Wive2D.Line = function()
    {
        Wive2D.Object.call(this);

        this.Type = 'Line';
        this.Color = '#fff';
        this.StokeSize = 1;
        this.EndPosition = Vector2D(0, 0, this.Event);
    }
    Wive2D.Line.prototype = Object.create(Wive2D.Object.prototype);

    Wive2D.Line.prototype.Clone =  function()
    {
        return clone(this);
    };
    Wive2D.Line.prototype.Set = function(_color)
    {
        this.Color = _color || '#fff';
    };
}
/*---------------End Line---------------*/

/*---------------Begin exLine---------------*/
{
    Wive2D.exLine = function()
    {
        Wive2D.Object.call(this);

        this.Type = 'exLine';
        this.Color = '#fff';
        this.StokeSize = 1;
        this.EndPosition = Vector2D(0, 0, this.Event);
        this.ControlPosition = Vector2D(0, 0, this.Event);
    }
    Wive2D.exLine.prototype = Object.create(Wive2D.Object.prototype);

    Wive2D.exLine.prototype.Clone =  function()
    {
        return clone(this);
    };
    Wive2D.exLine.prototype.Set = function(_color)
    {
        this.Color = _color || '#fff';
    };
}
/*---------------End exLine---------------*/

/*---------------Begin Circle---------------*/
{
    Wive2D.Circle = function()
    {
        Wive2D.Object.call(this);

        this.Type = 'Circle';
        this.Color = '#fff';
        this.SColor = '#999';		
    }
    Wive2D.Circle.prototype = Object.create(Wive2D.Object.prototype);

    Wive2D.Circle.prototype.Clone =  function()
    {
        return clone(this);
    };
    Wive2D.Circle.prototype.Set = function(_color,_scolor)
    {
        this.Color = _color || '#fff';
        this.SColor = _scolor || '#999'; 
    };
}
/*---------------End Circle---------------*/

/*---------------Begin Rect---------------*/
{
    Wive2D.Rect = function()
    {
        Wive2D.Object.call(this);

        this.Type = 'Rect';
        this.Color = '#fff';
        this.SColor = '#999';
        this.StokeSize = 1;
    }

    Wive2D.Rect.prototype = Object.create(Wive2D.Object.prototype);

    Wive2D.Rect.prototype.Set = function(_color, _scolor)
    {
        this.Color = _color || '#fff';
        this.SColor = _scolor || '#999';
    };
    
}
/*---------------End Rect---------------*/

/*---------------Begin Image---------------*/
{
    Wive2D.Image = function()
    {
        this.Img = {};
        this.Img.Loaded = false;
        this.isImg = false;
        this.src = '';
    }
    Wive2D.Image.prototype =
    {
        constructor: Wive2D.Image,
        Set: function(_src)
        {
            this.src = _src;
            var _Image = new Image();
            _Image.src = _src;
            _Image.onload = function() 
            { 
                _Image.Loaded = true;
            };

            this.Img = _Image;
            if(this.Img)
                this.isImg = true;
        }
    }
}
/*---------------End Image---------------*/

/*---------------Begin Pattern---------------*/
{
    Wive2D.Pattern = function()
    {
        this.Type = 'Pattern';
        this.Image = new Wive2D.Image();
        this.Option = 'no-repeat';
        this.isRender = false; 
    }
    Wive2D.Pattern.prototype =
    {
        constructor: Wive2D.Pattern,
        Set: function(_src, _o)
        {
            this.Image.Set(_src);
            this.Option = _o || 'no-repeat';
        }
    }
}
/*---------------End Pattern---------------*/

/*---------------Begin GradientLinear---------------*/
{
    Wive2D.GradientLinear = function()
    {
        this.Type = 'GradientLinear';
        this.SColor = '#fff';
        this.EColor = '#999';
        this.SPoint = {
            x : 0,
            y : 0
        };
        this.EPoint = {
            x : 0,
            y : 0
        };
    }
    Wive2D.GradientLinear.prototype =
    {
        constructor: Wive2D.GradientLinear,
        Set: function(_scolor, _ecolor, _spoint, _epoint)
        {
            this.SColor = _scolor || '#fff';
            this.EColor = _ecolor || '#999';
            this.SPoint = _spoint || {x : 0, y : 0};
            this.EPoint = _epoint || {x : 0, y : 0};
        }
    }
}
/*---------------End GradientLinear---------------*/

/*---------------Begin GradientRadial---------------*/
{
    Wive2D.GradientRadial = function()
    {
        this.Type = 'GradientRadial';
        this.SColor = '#fff';
        this.EColor = '#999';
        this.SRadius = {
            x : 0,
            y : 0,
            r : 10
        };
        this.ERadius = {
            x : 0,
            y : 0,
            r : 200
        };
    }
    Wive2D.GradientRadial.prototype =
    {
        constructor: Wive2D.GradientRadial,
        Set: function(_scolor, _ecolor, _sR, _eR)
        {
            this.SColor = _scolor || '#fff';
            this.EColor = _ecolor || '#999';
            this.SRadius = _sR || {x : 0, y : 0, r : 10};
            this.ERadius = _eR || {x : 0, y : 0, r : 200};
        }
    }
}
/*---------------End GradientRadial---------------*/


/*---------------Begin Sprite---------------
{
    Wive2D.Sprite = function()
    {
        Wive2D.Object.call(this);
        Wive2D.Image.call(this);

        this.Type = 'Sprite';
        this.Filter = null;
        this.Attach = Vector2D(0, 0);
        this.AttachAngle = 0;
        this.ParentAttachAngle = 0;
        this.WidthBox = 4;
        this.isBox = false;
        this.isLock = false;
        this.isMove = false;
        this.isSTL = false;
        this.isSTR = false;
        this.isSBL = false;
        this.isSBR = false;
        this.onNode = false;
        this.onSTL = false;
        this.onSTR = false;
        this.onSBL = false;
        this.onSBR = false;
        this.Animation = new Wive2D.SpriteAnimation();
        this.Frame = 0;
        this.Time = 0;

    }
    Wive2D.Sprite.prototype = Object.create(Wive2D.Image.prototype);
    Wive2D.Sprite.prototype.Clone = function()
    {
            return clone(this);
    }
    Wive2D.Sprite.prototype.GetPosition = function()
    {
        if(this.Attach.x != 0 && this.Attach.y != 0)
        return Vector2D(this.Attach.x + this.Position.x,
                            this.Attach.y - this.Position.y);
        else
        return Vector2D(this.Position.x, this.Position.y);
    }
    Wive2D.Sprite.prototype.GetAttachPosition = function()
    {
        if(this.Attach.x != 0 && this.Attach.y != 0)
        return Vector2D(this.Attach.x,
                            this.Attach.y);
        else
        return Vector2D(this.Position.x, this.Position.y);
    }
}
---------------End Sprite---------------*/

/*---------------Begin Camera---------------*/
{
    Wive2D.Camera = function(_x,_y)
    {
        this.Position = Vector2D(_x, _y);
    }
    Wive2D.Camera.prototype = 
    {
        constructor: Wive2D.Camera,

        Move: function(_x, _y) { this.Position.x += _x;
                                this.Position.y += _y;},

        Focus: function(_obj, _offset=Vector2D(0, 0))
        {
            this.Position.x = _obj.Position.x+_offset.x;
            this.Position.y = _obj.Position.y+_offset.y;
        }
    }
}
/*---------------End Camera---------------*/

/*---------------Begin Layer---------------*/
{
    Wive2D.Layer = function(_width,_height,_depth, _canvas = 0, _parent = 0)
    {
        if(_canvas == 0 )
        {
            this.Canvas = document.createElement('canvas');		
            this.Canvas.width = _width;
            this.Canvas.height = _height;
            this.Canvas.style.zIndex = 1000+_depth;
            if(_parent == 0)
                document.body.appendChild(this.Canvas);
            else
                _parent.appendChild(this.Canvas);
        }
        else this.Canvas = _canvas;
        
        this.Canvas.style.zIndex = 1000+_depth;
        this.Context = this.Canvas.getContext('2d');
        

        this.Width = _width;
        this.Height = _height;	
        this.Visible = true;
        this.Alpha = 1;
        this.Func = "S";
        this._Objs = [];
        this.Camera = new Wive2D.Camera(0,0);
    }

    Wive2D.Layer.prototype = 
    {
        constructor: Wive2D.Layer,

        isLookScene: function (_obj) 
        {
            if ((_obj.Position.x * Wive2D.Zoom + _obj.Size.x * Wive2D.Zoom + this.Camera.Position.x > 0) &&
                                (_obj.Position.x * Wive2D.Zoom +_obj.Size.x * Wive2D.Zoom + this.Camera.Position.x < this.Width) &&
                            (_obj.Position.y * Wive2D.Zoom + _obj.Size.y * Wive2D.Zoom + this.Camera.Position.y > 0) &&
                                (_obj.Position.y * Wive2D.Zoom + _obj.Size.y * Wive2D.Zoom  + this.Camera.Position.y < this.Height))
                return true;
            return false;
        },
        Add: function(_obj)
        {
            this._Objs.push(_obj);
        },
        Set: function(_id,_obj)
        {
            this._Objs.splice(_id,1,_obj);
        },
        Remove: function(_id, _count = 1)
        {
            this._Objs.splice(_id,_count);
        },        
        Get: function(_id)
        {
            return this._Objs[_id];
        },
        Length: function(){ return this._Objs.length; },
        Fill: function(_style,_x,_y,_width,_height)
        {
            var Width = 0;
            var Height = 0;
            var X = 0;
            var Y = 0;

            if(typeof _x != 'undefined' && typeof _y != 'undefined' && typeof _width != 'undefined' && typeof _height != 'undefined')
                { this.Context.rect(_x, _y, _width, _height); X = _x; Y = _y; Width = _width; Height = _height; }
            else
                { this.Context.rect(0, 0, this.Canvas.width, this.Canvas.height); Width = this.Canvas.width; Height = this.Canvas.height; }

            if(_style.Type == "Pattern" && !_style.isRender)
            {	
                if(_style.Image.Img.Loaded)
                {
                    var Height = (this.Canvas.height<_style.Image.Img.height)?this.Canvas.height / (this.Canvas.width / _style.Image.Img.width):this.Canvas.height * (this.Canvas.width / _style.Image.Img.width);
                    var Width = this.Canvas.width * (this.Canvas.height / _style.Image.Img.height);
                    
                    this.Context.drawImage(
                    _style.Image.Img,
                    0, 0,
                    _style.Image.Img.width, _style.Image.Img.height,
                    0, -100,
                    this.Canvas.width, Height-150);						
                    _style.isRender = true;
                }
            }
            else if(_style.Type == 'GradientLinear')
            {
                var grd = this.Context.createLinearGradient(X+_style.SPoint.x, Y+_style.SPoint.y, X+_style.EPoint.x, Y+_style.EPoint.y);
                grd.addColorStop(0, _style.SColor);   
                grd.addColorStop(1, _style.EColor);
                this.Context.fillStyle = grd;
                this.Context.fill();
            }
            else if(_style.Type == 'GradientRadial')
            {
                var grd = this.Context.createRadialGradient(X+_style.SRadius.x, Y+_style.SRadius.y, _style.SRadius.r, 
                                                            X+_style.ERadius.x, Y+_style.ERadius.y, _style.ERadius.r);
                grd.addColorStop(0, _style.SColor);   
                grd.addColorStop(1, _style.EColor);
                this.Context.fillStyle = grd;
                this.Context.fill();
            }			
            else if(_style.Type != "Pattern")
            {
                this.Context.fillStyle = _style;
                this.Context.fill();
            }			
        },

        Clear: function()
        {
            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        },

        DrawSprite: function(_sprite)
        {
            if(!_sprite.Visible) return;

            if(_sprite.Img.Loaded && !_sprite.Event.isRender)
            {

                var Parent = Vector2D(0, 0);
                if(_sprite.Parent)
                    Parent = _sprite.Parent.Position.Clone();

                if(_sprite.AttachAngle||_sprite.ParentAttachAngle)
                {
                    this.Context.save();
                    this.Context.translate(_sprite.GetAttachPosition().x-this.Camera.Position.x, _sprite.GetAttachPosition().y-this.Camera.Position.y);
                    this.Context.rotate(degToRad(_sprite.ParentAttachAngle+_sprite.AttachAngle));
                    this.Context.translate(-_sprite.GetAttachPosition().x-this.Camera.Position.x, -_sprite.GetAttachPosition().y-this.Camera.Position.y);																							
                }

                if (_sprite.Angle || _sprite.Flip.x || _sprite.Flip.y)
                {
                    this.Context.save();
                    this.Context.translate(_sprite.GetPosition().x-this.Camera.Position.x, _sprite.GetPosition().y-this.Camera.Position.y);
                    this.Context.rotate(degToRad(_sprite.Angle));
                    this. wszx65
                    this.Context.translate(-_sprite.GetPosition().x-this.Camera.Position.x, -_sprite.GetPosition().y-this.Camera.Position.y);
                }

                this.Context.clearRect(Parent.x+(_sprite.GetPosition().x-_sprite.Size.x/2)-this.Camera.Position.x, 
                    Parent.y+(_sprite.GetPosition().y-_sprite.Size.y/2)-this.Camera.Position.y, 
                    _sprite.Size.x, _sprite.Size.y);

                if(_sprite.Animation.isEnable)
                {
                    if(_sprite.Animation.Loop)
                        { if(_sprite.Frame > _sprite.Animation.Frames-1) _sprite.Frame = 0;}
                    else if(_sprite.Frame > _sprite.Animation.Frames-1) return;

                    this.Context.drawImage(
                    _sprite.Img,
                    (_sprite.Animation.Position.x+_sprite.Animation.Size.x*_sprite.Frame),_sprite.Animation.Position.y,
                    _sprite.Animation.Size.x, _sprite.Animation.Size.y,
                    Parent.x+(_sprite.GetPosition().x-_sprite.Size.x/2)-this.Camera.Position.x, Parent.y+(_sprite.GetPosition().y-_sprite.Size.y/2)-this.Camera.Position.y,
                    _sprite.Size.x + _sprite.Animation.Cut.x, _sprite.Size.y + _sprite.Animation.Cut.y);
                }
                else
                {
                    this.Context.drawImage(
                    _sprite.Img,
                    0,0,
                    _sprite.Img.width/_sprite.Animation.Frames, _sprite.Img.height,
                    Parent.x+(_sprite.GetPosition().x-_sprite.Size.x/2)-this.Camera.Position.x, Parent.y+(_sprite.GetPosition().y-_sprite.Size.y/2)-this.Camera.Position.y,
                    _sprite.Size.x, _sprite.Size.y);
                }

                _sprite.onNode = false;
                _sprite.onSTL = false;
                _sprite.onSTR = false;
                _sprite.onSBL = false;
                _sprite.onSBR = false;

                if(_sprite.isBox)
                {
                    this.Context.strokeStyle = 'black';
                    this.Context.lineWidth = 2;
                    this.Context.beginPath();
                        this.Context.rect(_sprite.GetPosition().x-this.Camera.Position.x-(_sprite.Size.x-_sprite.WidthBox)/2, _sprite.GetPosition().y-this.Camera.Position.y-(_sprite.Size.y-_sprite.WidthBox)/2,
                                _sprite.Size.x-_sprite.WidthBox, _sprite.Size.y-_sprite.WidthBox);
                    this.Context.stroke();
                    if(this.Context.isPointInPath(Wive2D.Mouse.x,Wive2D.Mouse.y)) _sprite.onNode = true;
                    this.Context.closePath();

                    this.Context.fillStyle = 'yellow';
                    this.Context.beginPath();
                    this.Context.rect(_sprite.GetPosition().x-this.Camera.Position.x-(_sprite.Size.x+_sprite.WidthBox)/2, _sprite.GetPosition().y-this.Camera.Position.y-(_sprite.Size.y+_sprite.WidthBox)/2,
                            _sprite.WidthBox, _sprite.WidthBox);
                    this.Context.fill();
                    if(this.Context.isPointInPath(Wive2D.Mouse.x,Wive2D.Mouse.y))_sprite.onSTL = true;
                    this.Context.closePath();

                    this.Context.beginPath();
                    this.Context.rect(_sprite.GetPosition().x-this.Camera.Position.x-(_sprite.Size.x+_sprite.WidthBox)/2, _sprite.GetPosition().y-this.Camera.Position.y+_sprite.Size.y-(_sprite.Size.y+_sprite.WidthBox)/2,
                            _sprite.WidthBox, _sprite.WidthBox);
                    this.Context.fill();
                    if(this.Context.isPointInPath(Wive2D.Mouse.x,Wive2D.Mouse.y))_sprite.onSBL = true;
                    this.Context.closePath();

                    this.Context.beginPath();
                    this.Context.rect(_sprite.GetPosition().x-this.Camera.Position.x+_sprite.Size.x-(_sprite.Size.x+_sprite.WidthBox)/2, _sprite.GetPosition().y-this.Camera.Position.y-(_sprite.Size.y+_sprite.WidthBox)/2,
                            _sprite.WidthBox, _sprite.WidthBox);
                    this.Context.fill();
                    if(this.Context.isPointInPath(Wive2D.Mouse.x,Wive2D.Mouse.y))_sprite.onSTR = true;
                    this.Context.closePath();

                    this.Context.beginPath();
                    this.Context.rect(_sprite.GetPosition().x-this.Camera.Position.x+_sprite.Size.x-(_sprite.Size.x+_sprite.WidthBox)/2, _sprite.GetPosition().y-this.Camera.Position.y+_sprite.Size.y-(_sprite.Size.y+_sprite.WidthBox)/2,
                            _sprite.WidthBox, _sprite.WidthBox);
                    this.Context.fill();
                    if(this.Context.isPointInPath(Wive2D.Mouse.x,Wive2D.Mouse.y))_sprite.onSBR = true;					
                    this.Context.closePath();
                }

                if (_sprite.Angle || _sprite.Flip.x || _sprite.Flip.y) 
                    this.Context.restore();	

                if (_sprite.AttachAngle||_sprite.ParentAttachAngle)	
                    this.Context.restore();

                if(_sprite.Animation.isEnable)
                    if(_sprite.Time >= 1) {_sprite.Frame++; _sprite.Time = 0;}
                    else _sprite.Time+=_sprite.Animation.Speed;	

                    if(_sprite.Filter)
                    {
                        var imageX = Parent.x+(_sprite.GetPosition().x-Math.ceil(_sprite.Size.x/2))-this.Camera.Position.x;
                        var imageY = Parent.y+(_sprite.GetPosition().y-Math.ceil(_sprite.Size.y/2))-this.Camera.Position.y;
                        var imageWidth = _sprite.Size.x;
                        var imageHeight = _sprite.Size.y;

                        _sprite.Filter.Fill(_sprite.Filter.Color,
                        imageX, 
                        imageY,
                        imageWidth, imageHeight);

                        var imageData1 = this.Context.getImageData(imageX, imageY, imageWidth, imageHeight);
                        var data1 = imageData1.data;
                        var imageData2 = _sprite.Filter.Context.getImageData(imageX, imageY, imageWidth, imageHeight);
                        var data2 = imageData2.data;
                        this.Context.clearRect(imageX, imageY, imageWidth, imageHeight);

                        for(var y = 0; y < imageHeight; y++) {
                        for(var x = 0; x < imageWidth; x++) {
                            var pos = ((imageWidth * y) + x);
                            var r = data1[pos * 4];
                            var g = data1[pos * 4 + 1];
                            var b = data1[pos * 4 + 2];
                            if((data1[pos * 4 + 3]/255) != 0.0)
                            {
                                r /= 255;
                                r += ((data2[pos * 4]/255) * (data2[pos * 4 + 3]/255));
                                if(_sprite.Filter.Func == "U")
                                    r *= ((data2[pos * 4]/255) * (data2[pos * 4 + 3]/255))*2;
                                r *= 255;
                                
                                g /= 255;
                                g += ((data2[pos * 4 + 1]/255) * (data2[pos * 4 + 3]/255));
                                if(_sprite.Filter.Func == "U")
                                    g *= ((data2[pos * 4 + 1]/255) * (data2[pos * 4 + 3]/255))*2;
                                g *= 255;

                                b /= 255;
                                b += ((data2[pos * 4 + 2]/255) * (data2[pos * 4 + 3]/255));
                                if(_sprite.Filter.Func == "U")
                                    b *= ((data2[pos * 4 + 2]/255) * (data2[pos * 4 + 3]/255))*2;
                                b *= 255;
                            }
                            this.Context.fillStyle = 'rgba(' + Math.ceil(r)
                            + ',' + Math.ceil(g)
                            + ',' + Math.ceil(b)
                            + ',' + (data1[pos*4+3]/255) + ')';
                            this.Context.fillRect(x + imageX, y + imageY, 1, 1);
                        }
                        }

                        _sprite.Filter.Clear();
                    }	
            }
            if(!_sprite.Animation.isEnable)
                _sprite.Event.isRender = true;
            else
                _sprite.Event.isRender = false;
        },
        
        Draw: function()
        {
            this.Clear();
            
            if(!this.Visible) return;
            
            for(var i = 0; i < this._Objs.length; i++)
            {

                if(!this.isLookScene(this._Objs[i])) continue;

                switch(this._Objs[i].Type)
                {
                    case 'Sprite': 
                    {
                        this.DrawSprite(this._Objs[i]);	
                    }
                    break;

                    case 'Circle':
                    {
                        if(!this._Objs[i].Visible) continue;
                        this.Context.beginPath();
                        this.Context.arc(this._Objs[i].Position.x * Wive2D.Zoom+this.Camera.Position.x, this._Objs[i].Position.y * Wive2D.Zoom+this.Camera.Position.y, this._Objs[i].Size.x * Wive2D.Zoom, 0, 2 * Math.PI, false);
                        this.Context.fillStyle = this._Objs[i].Color;
                        this.Context.fill();
                        this.Context.lineWidth = this._Objs[i].Size.y  * Wive2D.Zoom;
                        this.Context.strokeStyle = this._Objs[i].SColor;
                        this.Context.stroke();
                    }
                    break;

                    case 'Rect':
                    {
                        if(!this._Objs[i].Visible) continue;

                        this.Context.beginPath();
                        this.Fill(this._Objs[i].Color, this._Objs[i].Position.x * Wive2D.Zoom + this.Camera.Position.x - this._Objs[i].Size.x/2, this._Objs[i].Position.y * Wive2D.Zoom + this.Camera.Position.y -this._Objs[i].Size.y/2,
                                        this._Objs[i].Size.x * Wive2D.Zoom, this._Objs[i].Size.y * Wive2D.Zoom);   
                        this.Context.lineWidth = this._Objs[i].StokeSize  * Wive2D.Zoom;
                        this.Context.strokeStyle = this._Objs[i].SColor;
                        this.Context.stroke();
                    }
                    break;
                    
                    case 'Line':
                    {
                        if(!this._Objs[i].Visible) continue;                        
                        this.Context.beginPath();
                        this.Context.moveTo(this._Objs[i].Position.x * Wive2D.Zoom + this.Camera.Position.x, this._Objs[i].Position.y * Wive2D.Zoom + this.Camera.Position.y);
                        this.Context.lineTo(this._Objs[i].EndPosition.x * Wive2D.Zoom + this.Camera.Position.x, this._Objs[i].EndPosition.y * Wive2D.Zoom + this.Camera.Position.y );
                        this.Context.lineWidth = this._Objs[i].StokeSize * Wive2D.Zoom;
                        this.Context.strokeStyle = this._Objs[i].Color;
                        this.Context.stroke();
                    }
                    break;
                    
                    case 'exLine':
                    {
                        if(!this._Objs[i].Visible) continue;                        
                        this.Context.beginPath();
                        this.Context.moveTo(this._Objs[i].Position.x * Wive2D.Zoom + this.Camera.Position.x, this._Objs[i].Position.y * Wive2D.Zoom + this.Camera.Position.y);
                        this.Context.quadraticCurveTo(this._Objs[i].ControlPosition.x * Wive2D.Zoom + this.Camera.Position.x, this._Objs[i].ControlPosition.y * Wive2D.Zoom + this.Camera.Position.y, this._Objs[i].EndPosition.x * Wive2D.Zoom + this.Camera.Position.x, this._Objs[i].EndPosition.y * Wive2D.Zoom + this.Camera.Position.y);
                        this.Context.lineWidth = this._Objs[i].StokeSize * Wive2D.Zoom;
                        this.Context.strokeStyle = this._Objs[i].Color;
                        this.Context.stroke();

                    }
                    break;                   
                }

            }

        },

        SetSize: function(_width, _height)
        {
            this.Canvas.width = _width;
            this.Canvas.height = _height;
            this.Width = _width;
            this.Height = _height;
        },

        SetVisible: function (_bool)
        {
            if(_bool)
                {
                    this.Canvas.style.display = 'block';
                    this.Visible = true;
                }
            else
                {
                    this.Canvas.style.display = 'none';
                    this.Visible = false;
                }
        },

        SetAlpha: function (_alpha)
        {
            this.Canvas.style.opacity = _alpha;
            this.Alpha = _alpha;

            for(var i = 0; i < this._Objs.length; i++)
            {
                switch(this._Objs[i].Type)
                {
                    case 'Sprite': 
                    {
                        this._Objs[i].Event.isRender = false;	
                    }
                    break;
                }
            }			
        },

        ReRender: function ()
        {
            for(var i = 0; i < this._Objs.length; i++)
            {
                switch(this._Objs[i].Type)
                {
                    case 'Sprite': 
                    {
                        this._Objs[i].Event.isRender = false;	
                    }
                    break;
                }
            }			
        },
        
        GetImage: function()
        {
            return this.Context.getImageData(0, 0, this.Width, this.imageHeight);
        }
    }		
}
/*---------------End Layer---------------*/

/*---------------Begin Scene---------------*/
{
    Wive2D.Scene = function () 
    {
        /*Переменные*/
        this._Layers = [];
    }

    Wive2D.Scene.prototype = 
    {
        constructor: Wive2D.Scene,

        Add: function (_layer) 
        {
            this._Layers.push(_layer);
        },

        Render: function()
        {
            for(var i = 0; i < this._Layers.length; i++)
                this._Layers[i].Draw();
        },
        
        SetVisible: function(_visible)
        {
            for(var i = 0; i < this._Layers.length; i++)
                this._Layers[i].SetVisible(_visible);            
        }
    }
}
/*---------------End Scene---------------*/

/*---------------Begin Engine---------------*/
{
    Wive2D.Engine = function () 
    {
        this.Cursor = 'auto';
    }

    Wive2D.Engine.prototype = 
    {
        constructor: Wive2D.Engine,

        SetCursorImage: function (_id, _curImg) 
        {
            obj(_id).style.cursor = 'url("'+_curImg+'"), auto';
            this.Cursor = obj(_id).style.cursor;
        },

        ShowCursor: function (_id)
        {
            obj(_id).style.cursor = this.Cursor;
        },

        HideCursor: function (_id)
        {
            obj(_id).style.cursor = 'none';
        },

        Render: function(_scene)
        {
            _scene.Render();
        }
    }
}
/*---------------End Engine---------------*/
