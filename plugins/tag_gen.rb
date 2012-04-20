module Jekyll
  class TagIndex < Page
    def initialize(site, base, tag_dir, tag)
      @site = site
      @base = base
      @dir = tag_dir
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag_index.html')
      self.data['tag'] = tag
      tag_title_prefix = site.config['tag_title_prefix'] || 'Posts Tagged &ldquo;'
      tag_title_suffix = site.config['tag_title_suffix'] || '&rdquo;'
      self.data['title'] = "#{tag_title_prefix}#{tag}#{tag_title_suffix}"
    end
  end

  class GenerateTags < Generator
    safe true
    def generate(site)
      if site.layouts.key? 'tag_index'
        dir = site.config['tag_dir'] || 'tag'
        site.tags.keys.each do |tag|
          write_tag_index(site, File.join(dir, tag), tag)
        end
      end
    end
    def write_tag_index(site, dir, tag)
      index = TagIndex.new(site, site.source, dir, tag)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end

  # Adds some extra filters used during the tag creation process.
  module Filters

    # Outputs a list of categories as comma-separated <a> links. This is used
    # to output the tag list for each post on a tag page.
    #
    #  +categories+ is the list of categories to format.
    #
    # Returns string
    #
    def tag_links(categories)
      dir = @context.registers[:site].config['tag_dir']
      categories = categories.sort!.map do |item|
        "<a class='tag' href='/#{dir}/#{item.gsub(/_|\P{Word}/, '-').gsub(/-{2,}/, '-').downcase}/'>#{item}</a>"
      end

      case categories.length
      when 0
        ""
      when 1
        categories[0].to_s
      else
        "#{categories[0...-1].join(', ')}, #{categories[-1]}"
      end
    end

  end

end