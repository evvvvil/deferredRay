#pragma once

#include "ofMain.h"
#include "ofxGui.h"

class RayMarcher {
	public:

		RayMarcher();

		void setup(ofEasyCam* _cam, ofVec2f renderSize);
		void draw();

		ofEasyCam* cam;
		ofFbo outFbo;
		ofVec2f renderSize;

		ofShader shad;
		ofxPanel gui;

		ofMatrix4x4 matView;
		//ofMatrix4x4 matViewInverse;
		ofMatrix4x4 matProj;
		//ofMatrix4x4 matProjInverse;
		ofMatrix4x4 matViewProj;
		//ofMatrix4x4 matViewProjInverse;
		ofParameter<ofVec2f> camNearFarPlane;
		ofVec3f camPos;
		ofParameter<float> fov;
		ofParameter<bool> inverseMatViewProj;
		ofPlanePrimitive plane;

		bool isDeferred;
};
