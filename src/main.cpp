#include "ofMain.h"
#include "ofApp.h"

//========================================================================
int main( ){
	ofGLWindowSettings settings;
	settings.setGLVersion(4, 0); // now we use OpenGL 4.1
	settings.setSize(1920, 1080);
	settings.windowMode = OF_WINDOW;
	ofCreateWindow(settings);
	ofRunApp(new ofApp());
}
