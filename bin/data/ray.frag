#version 410 core

uniform float fGlobalTime; // in seconds
uniform vec2 v2Resolution; // viewport resolution (in pixels)

//layout(location = 0) out vec4 out_color; // out_color must be written in order to see anything

layout (location = 0) out vec4 outputColor0;
layout (location = 1) out vec4 outputColor1;
layout (location = 2) out vec4 outputColor2;
layout (location = 3) out vec4 outputColor3;

float tAni;
vec2 uv;    // pixel pos

vec3 rayOrg;
vec3 rayDir;

vec3 outCol;
vec3 fogCol;
vec3 lightDir;

vec4 newPos;

vec3 baseCol;

vec3 normals;
vec3 position;

uniform vec3 camPos;


float mx(vec3 p){return max(max(p.x,p.y),p.z);}
float sdfBox(vec3 p,vec3 r) {return mx(abs(p)-r);}
float triprism( vec3 p, vec2 h ){
    vec3 q = abs(p);
    return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
}

mat2 r2(float r) {return mat2(cos(r),sin(r),-sin(r),cos(r));}

// OP
float opMod(inout float p, float size) {
  float hsize = size*0.5;
  float c = floor((p+hsize)/size);
  p = mod(p+hsize, size) - hsize;
  return c;
}

float opModMirror(inout float p, float size) {
  float hsize = size*0.5;
  float c = floor((p+hsize)/size);
  p = mod(p+hsize, size) - hsize;
  p *= mod(c,2.0)*2.0-1.0;
  return c;
}

float opModVMirror(inout float p, float size) {
  float hsize = size*0.5;
  float c = floor((p+hsize)/size);
  p = mod(p+hsize, size) - hsize;
  p *= mod(c,2.0)*2.0-1.0;
  return c;
}
// generator builds the final geometry virtually drawing the "primitive" built in buildBlock()
// in the newPos and with all the desired matrix transformation.
// it returns the collision beetween the rays and the final geometry (if i understood right..). 
vec2 generator( vec3 p ) {

  vec3 boxPos = p;
  vec3 boxPos2 = p;

  opModVMirror(boxPos.x,4.2);
  opModVMirror(boxPos2.x,4.2);

  float idBoxX = opMod(boxPos.x, 0);
  float idBoxX2 = opMod(boxPos2.x, 0);
  
  float idBoxY = opMod(boxPos.y, 0);
  float idBoxY2 = opMod(boxPos2.y, 0);
  
  boxPos2.xy *= r2(-.8);
  boxPos2.x += 1.5;
 
  float box = sdfBox(boxPos, vec3(2,2,.5));
  float box2 = sdfBox(boxPos2, vec3(1.5,3,.7));
  
  float res;
  float idMat;
  float bit;
  bit = max(-box2,box);

bit = abs(bit);

  res = bit;
if(idBoxX == 0 && idBoxY == 0 || idBoxX == 1 && idBoxY == 1 ) {
//  res = bit;
idMat = 1;
}
else {
  //res = 1;
idMat = 0;
}
  return vec2(res,idMat);
}

vec2 trace(vec3 ro, vec3 rd) {
  vec2 h,t=vec2(0.1);
  for(int i=0;i<128;i++){
    h = generator(ro+rd*t.x);
    if(h.x<.0001||t.x>50) break;
    t.x+=h.x;t.y=h.y;
  }
  if(t.x>50) t.x=0;  return t;
}

vec3 getNormals(vec3 po) {
  vec2 e = vec2(.00035, -.000035);
  return normalize(e.xyy*generator(e.xyy+po).x+e.yxy*generator(e.yxy+po).x+e.yyx*generator(e.yyx+po).x+e.xxx*generator(e.xxx+po).x);
}

float noise(vec3 p){
    vec3 ip=floor(p);p-=ip; 
    vec3 s=vec3(7,157,113);
    vec4 h=vec4(0.,s.yz,s.y+s.z)+dot(ip,s);
    p=p*p*(3.-2.*p); 
    h=mix(fract(sin(h)*43758.5),fract(sin(h+s.x)*43758.5),p.x);
    h.xy=mix(h.xz,h.yw,p.y);
    return mix(h.x,h.y,p.z); 
}

void setupScene(vec2 res) {
  // my pos
  uv = vec2( gl_FragCoord.x / res.x, gl_FragCoord.y / res.y);
  uv -= 0.5;
  uv /= vec2(res.y / res.x, 1);

  // raycasting setup
  // ray origin
  //rayOrg = vec3(sin(tAni*20)*-5, -cos(tAni*10)*-10, 25);
  //vec3 xxx = vec3(camPos.x/10,camPos.y/10,camPos.z/10);
  // rayOrg = vec3(0,0,20);
  rayOrg = camPos;
  // camera headings 
  vec3 cw = normalize(vec3(0)-rayOrg);  // cam target
  vec3 cu = normalize(cross(cw, vec3(0,1,0)));
  vec3 cv = normalize(cross(cu, cw));
  // ray direction
  rayDir = mat3(cu, cv, cw) * normalize(vec3(uv,0.5));
  
  outCol = vec3(.5)*(1-(length(uv)-.2));
  fogCol = outCol;
  lightDir = normalize(vec3(0.4, 0.6, 0.2));
}

void renderScene(vec2 res) {
  float dist = res.x;
  float matId = res.y;
  position = rayOrg + rayDir * res.x;
  normals = getNormals(position);


/*
  float diffuse = max(0,dot(normals,lightDir));
  float aor = dist/50;
  float ambientOcc = exp2(-2*pow(max(0,1-generator(position+normals*aor).x/aor),2));
*/  

  if(matId > 0) {
    baseCol = vec3(.7, 0, 0 ); // albedo color
  }
  else {
    baseCol = vec3(.7, .2, .5 + 0.1*(length(position - rayOrg)-10));
  }

  float diffuse=max(0.,dot(normals,lightDir)),//dif=diffuse becuase I ain't got time to cook torrance
    aor=dist/50.,ambientOcc=exp2(-2.*pow(max(0.,1.-generator(position+normals*aor).x/aor),2.)),//ao = ambient occlusion, aor = ambient occlusion range
    //spo=specular power, THIS TRICK is some fucking sweet gloss map generated from recursive noise function. Fuck yeah broski!
    spo=exp2(1.+3.*noise(newPos.xyz/vec3(0.4,.8,.8)+noise(newPos.xyz/vec3(0.1,.2,.2)))),
    fr=pow(1.+dot(normals,rayDir),4.);//Fresnel blends the geometry in the background with some sort of gradient edge reflection mother fucker
    vec3 sss=vec3(0.5)*smoothstep(0.,1.,generator(position+lightDir*0.4).x/0.4),//Fake sub surface fucking scattering, from tekf, big up tekf! https://www.shadertoy.com/view/lslXRj
    sp=vec3(0.5)*pow(max(dot(reflect(-lightDir,normals),-rayDir),0.),spo);//specular by shane. Even better than rubbing your cheeks against frozen barbed-wire

    outCol=mix(sp+baseCol*(0.8*ambientOcc+0.2)*(diffuse+sss),fogCol,min(fr,0.2));//Final lighting result: taking it all in, and then crushing it into an RGB shit sandwich
//    outCol=mix(sp+baseCol*(0.8*ao+0.2)*(dif+sss),fogCol,min(fr,0.2));//Final lighting result: taking it all in, and then crushing it into an RGB shit sandwich

//  outCol = baseCol*(0.8+ambientOcc+0.2)*diffuse;
  outCol = mix(outCol, fogCol, 1-exp(-.00003*dist*dist*dist));
}

void main(void) {
  vec2 screenRes = v2Resolution;  // for framework compatibility (only one point to change var name)
  tAni = mod(fGlobalTime*0.1,100);

  setupScene(screenRes);

  vec2 scene = trace(rayOrg,rayDir);
  float result = scene.x;

  if(result > 0) {
    renderScene(scene); 
    outputColor0 = vec4(baseCol,1);
    outputColor1 = vec4(gl_FragCoord.x / screenRes.x, gl_FragCoord.y / screenRes.y, 0,1);
    outputColor2 = vec4(normals,scene.x);
  }

//outputColor3 = any(greaterThan(vColor, vec4(1.))) ? vColor : vec4(0.,0.,0.,1.);
//  out_color = vec4(outCol,1);
}