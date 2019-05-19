#include "RayMarcher.h"

//--------------------------------------------------------------
RayMarcher::RayMarcher() {
	shad.load("raymarchShader");
}

//--------------------------------------------------------------
void RayMarcher::setup(ofEasyCam* _cam, ofVec2f _renderSize) {
	gui.setup("broski");
	gui.add(camNearFarPlane.set("NEAR/FAR PLANE", ofVec2f(0.01f, 100.f), ofVec2f(0.f, 10.f), ofVec2f(0.f, 1000.f)));
	renderSize = _renderSize;

	cam = _cam;
	cam->setAutoDistance(false);
	cam->setPosition(0, 0, 40);
	cam->setNearClip(camNearFarPlane.get().x);
	cam->setFarClip(camNearFarPlane.get().y);
	fov.set("FOV broh", 70, 0, 100);

	plane.set(renderSize.x, renderSize.y);
}

//--------------------------------------------------------------
void RayMarcher::draw() {
	cam->setFov((float)fov);
	camPos = matView.getTranslation();

	matView = cam->getModelViewMatrix();
	matProj = cam->getProjectionMatrix();
	matProj = matProj.getInverse();
	matViewProj = cam->getModelViewProjectionMatrix();
	//matViewProj = cam->getGlobalTransformMatrix();
	//matProjInverse = matProj.getInverse();
	//matViewInverse = matProj.getInverse();
	//matViewProjInverse = matViewProj.getInverse();
	//if (inverseMatViewProj) matViewProj = matViewProj;
	shad.begin();
	shad.setUniform2f("resolution", renderSize);
	shad.setUniform2f("nearFarPlane", camNearFarPlane.get() * 2);
	shad.setUniform1f("time", ofGetElapsedTimef());
	shad.setUniformMatrix4f("matView", matView);
	//shad.setUniformMatrix4f("matViewInverse", matViewInverse);
	shad.setUniformMatrix4f("matProj", matProj);
	//shad.setUniformMatrix4f("matProjInverse", matProjInverse);
	shad.setUniformMatrix4f("matViewProj", matViewProj);
	//shad.setUniformMatrix4f("matViewProjInverse", matViewProjInverse);
	shad.setUniform3f("camPos", camPos * 2);
	plane.draw();
	shad.end();
}

//--------------------------------------------------------------


//--------------------------------------------------------------

