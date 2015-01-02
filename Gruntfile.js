/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		// Metadata
		pkg : grunt.file.readJSON('package.json'),
		version : '<%= pkg.version.replace(/-pre/, "") %>',
		banner : [
			'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ',
			'<%= grunt.template.today("yyyy-mm-dd") %>\n',
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>',
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;',
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
		].join(''),

		uglify: {
			options: {
				banner: '<%=banner%>'
			},
			dist : {
				src: 'dist/<%=pkg.name%>.js',
				dest: 'dist/<%=pkg.name%>.min.js'
			}
		},

		auidoc : {
			options : {
				json : 'build/doc/auidoc.json',
				dest : 'dist/doc'
			}
		},

		merge : {
			options : {
				dependency : 'dist/doc/dependency.js',
				dest: 'dist/<%=pkg.name%>.js'
			}
		},

		exec : {
			auidoc : {
				command: "node node_modules/auidocjs/lib/cli.js --config build/doc/auidoc.json .",
				stdout: false
			}
		},

		jshint : {
			all : {
				src : [ 'src/*.js' ],
				options : { jshintrc: true }
			}
        },

        githubtag : {
            options : {
                json : "bower.json",
                shell : {

                }
            }
        },

        shell : {
            makeBranch : {
                command : [
                    'git branch tmp_<%= version %>',
                    'git checkout tmp_<%= version %>'
                ].join("&&")
            },
            commit : {
                command : [
                    'git add <%= uglify.dist.src %> <%= uglify.dist.dest %>',
                    'git commit -m "bower" package.json bower.json <%= uglify.dist.src %> <%= uglify.dist.dest %>'
                ].join("&&")
            },
            makeTag : {
                command : [
                    'git tag <%= version %> tmp_<%= version %>',
                    'git push origin <%= version %>'
                ].join("&&")
            }
        }

	});

	// // These plugins provide necessary tasks.
	// grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('clean', function() {
		if (grunt.file.exists('dist')) {
			grunt.file.delete('dist', { force : true });
		}
	});

	grunt.registerTask('auidoc', 'API 문서 생성', function() {

		var options = this.options();

		var pkg = grunt.config.data.pkg;
		var jsonPath = options.json;

		// auidoc.json 파일의 version 정보 교체
		var auidocConf = grunt.file.readJSON(jsonPath);
		auidocConf.version = pkg.version;

		grunt.file.write(jsonPath, JSON.stringify(auidocConf, null, 4));

		// dist/doc 디렉토리 삭제
		var dest = options.dest;
		if (grunt.file.exists(dest)) {
			grunt.file.delete(dest, { force : true });
		}
		grunt.file.mkdir(dest);

		// AUIDoc 를 돌려서 dist/doc 생성
		grunt.task.run('exec');

	});

	grunt.registerTask('merge', '의존성을 고려하여 JS 머징', function() {

		var options = this.options();

		var pkg = grunt.config.data.pkg;
		var dependency = JSON.parse(grunt.file.read(options.dependency).replace(/(^[^\(]*\(|\)$)/g, ''));

		var lists = [];

		// AUIDoc 을 돌려서 나온 dependency.js 파일 내용 정리
		for (var name in dependency) {
			var item = dependency[name];
			lists.push({
				name : name,
				file : item.file,
				depends : (item.relation.extends || []).concat(item.relation.uses || [])
			});
		}

		// 의존성 정보를 기준으로 소팅
		(function sort(lists, fp) {
			var len = lists.length;
			for (var i = 0; i < len; i++) {
				for (var j = len - 1; j > i; j--) {
					if (fp(lists[i], lists[j])) {
						var tmp = lists[j];
						lists[j] = lists[i];
						lists[i] = tmp;
					}
				}
			}
		})(lists, function(s, d) {
			return (s.depends.indexOf(d.name) > -1);
		});

		grunt.file.preserveBOM = false;

		// 파일 데이터를 읽음
		var code = lists.map(function(o) {
			var filePath = o.file;
			return grunt.file.read(filePath).replace(/#__VERSION__#/g, pkg.version);
		});

		// 파일 데이터를 하나로 합쳐서 저장
		grunt.file.write(options.dest, code.join('\n'));

		grunt.log.oklns('merged :', options.dest);

	});

	// 각각 파일별로 qunit 실행
	grunt.registerTask('test', '전체/파일별 qunit 테스트', function() {

		var version = [ '1.5.3', 'latest' ];
		var lists = [];

		version.forEach(function(v) {
			lists.push('changeJindo:' + v);
			lists.push('qunit:each');
		});

		var eachfile = Array.prototype.slice.apply(arguments);
		eachfile = eachfile.map(function(v, i, a) {
			return "test/jindo." + v + ".test.html";
		}, this);

		if (eachfile.length) {

			grunt.config.set('qunit.each', eachfile);
			grunt.log.oklns(grunt.config.get('qunit.each'));

			grunt.task.run(lists);

		}

	});

	// 테스트 파일의 진도 바꾸기
	grunt.registerTask('changeJindo', 'jindo버전 바꾸기', function(version) {
		grunt.log.oklns("테스트용 Jindo " + version + " 으로 변경");
		grunt.file.copy("test/asset/jindo." + version + ".js", "test/asset/jindo.js" );
	});

	// Default task
	grunt.registerTask('default', function() {

		var tests = Array.prototype.slice.apply(arguments);

		grunt.task.run('clean');
		grunt.task.run('jshint');
		grunt.task.run('test' + (tests.length ? ':' + tests.join(':') : ''));
		grunt.task.run('auidoc');
		grunt.task.run('merge');
		grunt.task.run('uglify');

	});

    // 버전 변경
    grunt.registerTask('changeVersion', function(){
        var pkg = grunt.config.data.pkg;
        pkg.version = pkg.version.replace(/-pre/, "");
        grunt.file.write("package.json", JSON.stringify(pkg, null, 4));
    });

    // 임시 브랜치 생성
    grunt.registerTask("makeBranch", ['shell:makeBranch']);

    // 수정된 버전파일 및 dist 폴더 내 js 파일 commit
    grunt.registerTask("gitcommit", ['shell:commit']);

    // 태그 생성 및 push
    grunt.registerTask("makeTag", ['shell:makeTag']);

    // 태그 생성을 위한 dist 파일 추가의 일련의 과정
	grunt.registerTask('tagprocess', function() {

        var options = this.options();
        var pkg = grunt.config.data.pkg;
        var jsonPath = options.json;
        var bowerJson = grunt.file.readJSON(jsonPath);

        // bower 버전 수정
        bowerJson.version = pkg.version.replace(/-pre/,"");
        grunt.file.write(jsonPath, JSON.stringify(bowerJson, null, 4));

        grunt.task.run('makeBranch');
        grunt.task.run('changeVersion');
        grunt.task.run('clean');
		grunt.task.run('auidoc');
		grunt.task.run('merge');
		grunt.task.run('uglify');
		grunt.task.run('gitcommit');

    });

};

