Wive2D.Mouse = Vector2D(0.0, 0.0);
Wive2D.oldMouse = Vector2D(0.0, 0.0);
Wive2D.KeyDown = [];
Wive2D.KeyUp = [];
Wive2D.KeyPress = [];
Wive2D.MouseDown = [];
Wive2D.MouseUp = [];
Wive2D.MouseClick = [];
Wive2D.MouseWheel = 0;

Wive2D.KeyBoard = 
{
    'LEFT'      : 37,
    'RIGHT'     : 39,
    'UP'        : 38,
    'DOWN'      : 40,
    'SPACE'     : 32,
    'DEL'       : 46,
    'CTRL'      : 17,
    'SHIFT'     : 16,
    'ALT'       : 18,
    'ESC'       : 27,
    'ENTER'     : 13,
    'MINUS'     : 189,
    'PLUS'      : 187,
    'CAPS_LOCK' : 20,
    'BACKSPACE' : 8,
    'TAB'       : 9,
    'Q'         : 81,
    'W'         : 87,
    'E'         : 69,
    'R'         : 82,
    'T'         : 84,
    'Y'         : 89,
    'U'         : 85,
    'I'         : 73,
    'O'         : 79,
    'P'         : 80,
    'A'         : 65,
    'S'         : 83,
    'D'         : 68,
    'F'         : 70,
    'G'         : 71,
    'H'         : 72,
    'J'         : 74,
    'K'         : 75,
    'L'         : 76,
    'Z'         : 90,
    'X'         : 88,
    'V'         : 86,
    'B'         : 66,
    'N'         : 78,
    'M'         : 77,
    '0'         : 48,
    '1'         : 49,
    '2'         : 50,
    '3'         : 51,
    '4'         : 52,
    '5'         : 53,
    '6'         : 54,
    '7'         : 55,
    '8'         : 56,
    'C'         : 67,
    '9'         : 57,
    'NUM_0'     : 45,
    'NUM_1'     : 35,
    'NUM_2'     : 40,
    'NUM_3'     : 34,
    'NUM_4'     : 37,
    'NUM_5'     : 12,
    'NUM_6'     : 39,
    'NUM_7'     : 36,
    'NUM_8'     : 38,
    'NUM_9'     : 33,
    'NUM_MINUS' : 109,
    'NUM_PLUS'  : 107,
    'NUM_LOCK'  : 144,
    'F1'        : 112,
    'F2'        : 113,
    'F3'        : 114,
    'F4'        : 115,
    'F5'        : 116,
    'F6'        : 117,
    'F7'        : 118,
    'F8'        : 119,
    'F9'        : 120,
    'F10'       : 121,
    'F11'       : 122,
    'F12'       : 123
};

Wive2D.MouseKey = 
{
    'LEFT' : 1,
    'MIDDLE' : 2,
    'RIGHT' : 3
};

Wive2D.isKeyDown = function(_code)
{
    return Wive2D.KeyDown[Wive2D.KeyBoard[_code]];
}

Wive2D.isKeyUp = function(_code)
{
    if(Wive2D.KeyUp[Wive2D.KeyBoard[_code]])
    {
        Wive2D.KeyUp[Wive2D.KeyBoard[_code]] = false;
        return true;
    }	
    return false;
}

Wive2D.isKeyPress = function(_code)
{
    if(Wive2D.KeyPress[Wive2D.KeyBoard[_code]])
    {
        Wive2D.KeyPress[Wive2D.KeyBoard[_code]] = false;
        return true;
    }
    return false;
}

Wive2D.onKeyEvent = function(_e) 
{
    if (_e.type == 'keydown') 
    {
        Wive2D.KeyDown[_e.keyCode] = true;
        Wive2D.KeyPress[_e.keyCode] = true;
    } 
    else if (_e.type == 'keyup')
    {
        Wive2D.KeyDown[_e.keyCode] = false;
        Wive2D.KeyUp[_e.keyCode] = true;
    }
}

Wive2D.onMouseMove = function (_e) 
{
    Wive2D.oldMouse = Wive2D.Mouse;
    Wive2D.Mouse = Vector2D(_e.pageX, _e.pageY);
}

Wive2D.isMouseDown = function(_code)
{
    return Wive2D.MouseDown[Wive2D.MouseKey[_code]];
}

Wive2D.isMouseUp = function(_code)
{
    if(Wive2D.MouseUp[Wive2D.MouseKey[_code]])
    {		
        Wive2D.MouseUp[Wive2D.MouseKey[_code]] = false;
        return true;
    }
    return false;
}

Wive2D.isMouseClick = function(_code)
{
    if(Wive2D.MouseClick[Wive2D.MouseKey[_code]])
    {		
        Wive2D.MouseClick[Wive2D.MouseKey[_code]] = false;
        return true;
    }
    return false;
}

Wive2D.isMouseWheel = function(_code) {
return (_code == 'UP' && Wive2D.MouseWheel > 0) ||
        (_code == 'DOWN' && Wive2D.MouseWheel < 0);
};

Wive2D.onMouseWheel = function(_e)
{
    Wive2D.MouseWheel = ((_e.wheelDelta) ? _e.wheelDelta : -_e.detail);
}


Wive2D.onMouseEvent = function(_e)
{
    if (!_e.which && _e.button) 
    {
        if (_e.button & 1) _e.which = 1;
        else if (_e.button & 4) _e.which = 2;
        else if (_e.button & 2) _e.which = 3;
    }
    if (_e.type == 'mousedown') 
    {
        Wive2D.MouseClick[_e.which] = true;
        Wive2D.MouseDown[_e.which] = true;
        Wive2D.MouseUp[_e.which] = false;
    } 
    else if (_e.type == 'mouseup') 
    {
        Wive2D.MouseDown[_e.which] = false;
        Wive2D.MouseUp[_e.which] = true;
    }

    window.focus();
}

Wive2D.InitInput = function()
{
    window.focus();
    document.body.oncontextmenu = function() { return false; }
    document.body.onselectstart = document.body.oncontextmenu;
    document.body.ondragstart = document.body.oncontextmenu;
    document.body.onmousedown = function(e) { Wive2D.onMouseEvent(e); };
    document.body.onmouseup = function(e) { Wive2D.onMouseEvent(e); };
    document.body.onmousemove = function(e) { Wive2D.onMouseMove(e); };
    document.body.onkeydown = function(e){ Wive2D.onKeyEvent(e); };
    document.body.onkeyup = function(e){ Wive2D.onKeyEvent(e); };
    document.body.onkeypress = function(e){ Wive2D.onKeyEvent(e); };
    document.body.onmousewheel = function(e) { Wive2D.onMouseWheel(e); };	
}
