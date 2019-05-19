#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
	deferred.init(ofGetWidth(), ofGetHeight());
	ssaoPass = deferred.createPass<SsaoPass>();
	box.set(10);
	ray.setup(&cam, ofVec2f(ofGetWidth(), ofGetHeight()));
}

//--------------------------------------------------------------
void ofApp::update(){

}

//--------------------------------------------------------------
void ofApp::draw(){
	deferred.begin(cam, false);

	cam.begin();
	box.draw();
	cam.end();
	
	deferred.end();
	deferred.debugDraw();
	/*deferred.begin(cam, true);

	ray.draw();

	deferred.end();
	deferred.debugDraw();*/
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
	if (key == ' ') {
		ray.shad.unload();
		ray.shad.load("raymarchShader");
	}
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
