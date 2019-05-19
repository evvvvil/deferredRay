#version 430
uniform mat4 matView;
uniform mat4 matProj;
uniform mat4 matViewProj;
uniform vec2 resolution;
uniform vec2 nearFarPlane;
uniform vec3 camPos;
uniform float time;

// out vec4 outputColor;

layout (location = 0) out vec4 outputColor0;
layout (location = 1) out vec4 outputColor1;
layout (location = 2) out vec4 outputColor2;

float bo(vec3 p,vec3 r) {p=abs(p)-r;return max(max(p.x,p.y),p.z);}
vec2 s,e=vec2(.00035,-.00035);float t,tt;vec3 np;
mat2 r2(float r){return mat2(cos(r),sin(r),-sin(r),cos(r));}
vec2 mp( vec3 p )
{
    vec2 t=vec2(bo(p,vec3(12,12,12)),4);
    return t;
}
vec2 tr( vec3 ro, vec3 rd )
{
	vec2 h,t=vec2(nearFarPlane.x);
	for(int i=0;i<128;i++){
		h=mp(ro+rd*t.x);
		if(h.x<.0001||t.x>nearFarPlane.y) break;
		t.x+=h.x;t.y=h.y;
	}
	if(t.x>nearFarPlane.y) t.x=0;  return t;
}
vec3 getNormals(vec3 po) {
  vec2 e = vec2(.000035, -.000035);
  return normalize(e.xyy*mp(e.xyy+po).x+e.yxy*mp(e.yxy+po).x+e.yyx*mp(e.yyx+po).x+e.xxx*mp(e.xxx+po).x);
}
vec3 UVtoEYE(vec2 UV){ return normalize((vec4((vec4(UV,0,1)*matProj).xy,1,0)*matView).xyz);}
void main(void)
{
	tt=mod(time,100);
	vec2 uv=(vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y)*2-1)*vec2(-1,1);
	vec3 ro=(vec4(camPos,1)*matView).xyz,
	rd=UVtoEYE(uv),
	co,fo,ld=normalize(vec3(-.5,0.5,0.1));
	co=fo=vec3(1,.5,.2)-rd.y*.4;
	s=tr(ro,rd);t=s.x;
	if(t>0){
		vec3 po=ro+rd*t,no=normalize(e.xyy*mp(po+e.xyy).x+
		e.yyx*mp(po+e.yyx).x+
		e.yxy*mp(po+e.yxy).x+
		e.xxx*mp(po+e.xxx).x); 

		vec3 al=vec3(1,.5,0);
		// if(s.y<5)  al=vec3(0);
		// if(s.y>5)  al=vec3(1);
		// float dif=max(0,dot(no,ld)),
		// aor=t/50,
		// ao=exp2(2-pow(max(0,1-mp(po+no*aor).x/aor),2)),
		// spo=10;
		// float fr=pow(1+dot(no,rd),4),
		// sss=smoothstep(0,1,mp(po+ld*.4).x/.4),
		// sp=pow(max(dot(reflect(-ld,no),-rd),0),spo);
		// co=mix(sp+al*ao*(dif+sss),fo,min(fr,.5));
		
		outputColor0 = vec4(al,1); // albedo
		vec4 posWVP = vec4(po,1)*matViewProj;
		outputColor1 =vec4(uv.x, uv.y, 0,1); // position

		// this is what i'm sure is working, from vertex shad:
		//  	vec4 viewPos = modelViewProjectionMatrix * vec4(newVertexPos, 1.0);
    	//		vDepth = viewPos.z / (farClip - nearClip);
		//float vDepth = t / (nearFarPlane.y - nearFarPlane.x);
		no = normalize((vec4(no,0)*matViewProj).xyz);

		outputColor2 = vec4(no,t/(nearFarPlane.y - nearFarPlane.x)); // normals&depth
	}

	// co=mix(co,fo,1-exp(-.0000001*t*t*t));
	// outputColor = vec4(pow(co,vec3(.45)),1);
}