**JC - Jindo Component**
=========================================

## **What is JC?**
JC is a framework that make easier to develope desktop web UI. JC provide UI components like DragArea, DropArea, etc..

JC is the main JavaScript Component used for developing most of NAVER's web products.

> **Jindo Component is part of JindoJS family product**

> JindoJS consists with : `Jindo, Jindo Component and Jindo Mobile Component`

> - __Official website__ : http://jindo.dev.naver.com/
> - __Online API Documentation__(ko) : http://jindo.dev.naver.com/docs/jindo-component/latest/doc/external/

### **JC Features**
- Support cross platform and browsing in desktop environment
- Provide fast loading speed and optimal performance
- It makes to manage separately presentational markup and logic programming code
- Components can be extended through a custom event

## **How to install?**
```bash
bower install jindojs-jc
```

- **Manual download** :  
 - JC provide online download page. You can customize download by choosing components which will be utilized.
 - http://jindo.dev.naver.com/utils/downloader/selection/?target=jindo_component


## **Modules**
- The below list are modules that are used frequently.
 - For complete list and it's API, please visit :
 - http://jindo.dev.naver.com/docs/jindo-component/latest/doc/external/index.html

- **DragArea**: Make HTML element draggable.
- **DropArea**: Make HTML element droppable.
- **FileUploader**: Provide easy way of file upload via <iframe>, without page refresh.
- **Clipboard**: Set values on system clipboard using flash object.
- **FloatingLayer**: Fix the position of a layer, even the page was scrolled its position.

## **How to build**
Clone a copy of JC from git repo by running:
```bash
$ git clone https://github.com/naver/jindojs-jc.git
```

Enter the jindojs-jc directory and make sure have all the necessary dependencies :
```bash
$ cd jindojs-jc && npm install
```

Run the build script:
```bash
$ grunt
```
The result of your build, will be found in the `'dist/'` subdirectory with the minified version and API document.

## **Running the Unit Tests**
Make sure you have the necessary dependencies:
```bash
$ npm install
```

Start grunt 'test:*' task:
```bash
$ grunt test:*
```

if you want to test a specific component, put the module's name as a parameter of the test. Here are some example that you might consider.
```bash
$ grunt test:SlideFlicking  #test "jindo.m.SlideFlicking"
$ grunt test:m  #test "jindo.m"
$ grunt test:Touch  #test "jindo.m.Touch"
```

## **Issues**
If you find a bug, please report us via the GitHub issues page.  
https://github.com/naver/jindojs-jc/issues

## **License**
Licensed under LGPL v2:  
https://www.gnu.org/licenses/old-licenses/lgpl-2.0.html  

[![Analytics](https://ga-beacon.appspot.com/UA-45811892-5/jindojs-jc/readme)](https://github.com/naver/jindojs-jc)
