class Post < ActiveRecord::Base
  mount_uploader :picture_url, PictureUploader
	validates :title, :description,:picture_url, presence: true
  def full_serach
    "#{self.title}"+''+"#{self.description}"
  end
end
